# blogs

Full stack app for writing blogs with media. 

## API endpoints

### `/api/register`

#### `POST` request

Sign up to create a new user.

Takes `username` and `password` fields to create a user.
The username must be unique

##### Example

```bash
curl --request POST \
  --url http://localhost:3000/api/register \
  --header 'content-type: application/json' \
  --data '{
  "username": "John Doe",
  "password": "a"
}'
```

### `/api/register/renew`

#### `POST` request

Get a new bearer token for an existing user.

Takes `username` and `password` fields

##### Example

```bash
curl --request POST \
  --url http://localhost:3000/api/register/renew \
  --header 'content-type: application/json' \
  --data '{
  "username": "John Doe",
  "password": "a"
}'
```

### `/api/blogs`

#### `GET` request

Get an array of blogs

##### Example

```bash
curl --request GET \
  --url http://localhost:3000/api/blogs \
```

#### `POST` request

Create a blog. 

Takes optional parameters `contents` as string and `media` as a file with image or video mime types. 

##### Example

```bash
curl --request POST \
  --url http://localhost:3000/api/blogs \
  --header 'Authorization: Bearer <token>' \
  --header 'content-type: multipart/form-data' \
  --form contents=a
```

### `/api/blogs/:id`

#### `GET` request

Get one blog with the specified `id`. `id` must be an integer. 

##### Example

```bash
curl --request GET \
  --url http://localhost:3000/api/blogs/1
```

#### `PUT` request

Replace an existing blog with new data. 

##### Example

```bash
curl --request PUT \
  --url 'http://localhost:3000/api/blogs/1?contents=a' \
  --header 'Authorization: Bearer <token>' \
  --header 'content-type: multipart/form-data' \
  --form contents=abc
```

#### `DELETE` request

Delete one blog with the specified `id`. `id` must be an integer. 

##### Example

```bash
curl --request DELETE \
  --url http://localhost:3000/api/blogs/1 \
  --header 'Authorization: Bearer <token>'
```

## How to build

```bash
cd blogs-front-end
npm run build
cd ../blogs-back-end
npm run preview
```

and go to http://localhost:3000/
