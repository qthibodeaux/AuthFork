import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { supabase } from '../supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG files!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must be smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

function AntAvatar() {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const { userid } = useParams();

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
        setFile(info.file.originFileObj);
      });
    }
  };

  const handleSupabaseUpload = async () => {
    if (!file) {
      message.error('Please select an image first.');
      return;
    }

    setLoading(true);

    let fileName = `${userid}.${file.name.split('.').pop()}`;
    let retries = 0;

    while (true) {
      try {
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, file);

        if (uploadError) {
          throw uploadError;
        }

        const { error: updateError } = await supabase
          .from('profile')
          .update({ avatar_url: fileName })
          .eq('id', userid);

        if (updateError) {
          throw updateError;
        }

        message.success('Image uploaded successfully!');
        setLoading(false);
        navigate(`/profile/${userid}`);
        return;
      } catch (err) {
        if (err.statusCode === '409' && err.error === 'Duplicate') {
          retries++;
          fileName = `${userid}_${retries}.${file.name.split('.').pop()}`;
          continue; // Retry with new file name
        }

        console.error('Supabase upload error:', error);
        message.error('Upload failed. Please try again.');
        setError(err.message);
        setLoading(false);
        return;
      }
    }

    try {
      // Upload to Supabase storage
      // const { error: uploadError } = await supabase.storage.from('avatars').upload(file.name, file);

      // Update profile with avatar URL
      // const { error: updateError } = await supabase.from('profile').update({ avatar_url: file.name }).eq('id', userid);

      // Handle success or error
      // if (uploadError || updateError) {
      //   throw new Error('Upload failed.');
      // }

      // Success message
      message.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Supabase upload error:', error);
      message.error('Upload failed. Please try again.');
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div>
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
        ) : (
          uploadButton
        )}
      </Upload>
      <Button onClick={handleSupabaseUpload} disabled={!imageUrl}>
        Upload to Supabase
      </Button>
    </div>
  );
}

export default AntAvatar;
