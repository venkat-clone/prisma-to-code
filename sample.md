# Address API Documentation

## Get All Addresses
```http
GET https://api.example.com/addresses
Authorization: Bearer your_access_token
```
- **Description:** Retrieve all addresses
- **Response:** Array of Address objects

## Create Address
```http
POST https://api.example.com/addresses
Authorization: Bearer your_access_token
Content-Type: application/json

{
    "address": "123 Main St",
    "pincode": 560001,
    "isPrimary": false,
    "userid": 1
}
```
- **Description:** Create a new address
- **Required Fields:**
  - `address` (string)
  - `pincode` (integer)
  - `userid` (integer)
- **Optional Fields:**
  - `isPrimary` (boolean, default: false)

## Get Address by ID
```http
GET https://api.example.com/addresses/{id}
Authorization: Bearer your_access_token
```
- **Description:** Retrieve a specific address by its ID
- **URL Parameters:** 
  - `id`: Unique identifier of the address

## Update Address
```http
PUT https://api.example.com/addresses/{id}
Authorization: Bearer your_access_token
Content-Type: application/json

{
    "address": "456 Updated St",
    "pincode": 560002,
    "isPrimary": true
}
```
- **Description:** Update an existing address
- **URL Parameters:** 
  - `id`: Unique identifier of the address to update
- **Optional Fields:**
  - `address` (string)
  - `pincode` (integer)
  - `isPrimary` (boolean)

## Delete Address
```http
DELETE https://api.example.com/addresses/{id}
Authorization: Bearer your_access_token
```
- **Description:** Delete a specific address
- **URL Parameters:** 
  - `id`: Unique identifier of the address to delete

### Validation Rules
- `address`: Must be a string
- `pincode`: Must be an integer
- `isPrimary`: Boolean, defaults to false if not specified
- `userid`: Must be an integer referencing an existing user