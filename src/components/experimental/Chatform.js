import React, { useState } from 'react';
import { Button, DatePicker, Form } from 'antd';

const Chatform = () => {
    const [date, setDate] = useState(null);
  
    const handleDateChange = (value) => {
      setDate(value);
    };
  
    const handleSubmit = () => {
      if (!date) {
        // Handle the case where no date is selected
        console.error('Please select a date.');
        return;
      }
      // Submit the form data
      console.log('Selected Date:', date.format('YYYY-MM-DD'));
    };
  
    return (
      <Form>
        <Form.Item label="When is your birthday">
          <DatePicker
            onChange={handleDateChange}
            value={date}
            format="YYYY-MM-DD"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  };
  

export default Chatform;
