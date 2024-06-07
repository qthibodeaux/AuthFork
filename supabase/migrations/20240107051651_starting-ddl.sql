create table user_profiles (
  user_id uuid primary key references auth.users (id) not null,
  username text unique not null
);

alter table user_profiles enable row level security;

CREATE POLICY "all can see" ON "public"."user_profiles"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

CREATE POLICY "users can insert" ON "public"."user_profiles"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "owners can update" ON "public"."user_profiles"
AS PERMISSIVE FOR UPDATE
TO public
USING (auth.uid()=user_id)
WITH CHECK (auth.uid()=user_id);

create table roles (
  role_id int,
  rule_name varchar(50)
);

create table user_roles (
  user_id int references user_profiles(user_id),
  role_id int references roles(role_id)
);