# Files EndPoints, for products images & catalogues

front end should upload files first, and if ok, add then the product with the urls or image names

## /files/:image

#### GET

#### Required data

req.params.imageNameWithExtensionIfPossible

#### optional data

req.query.width
req.query.height

## /files/uploads/server

#### POST

#### Required data

req.body.file

## /files/uploads/mongo

#### POST

#### Required data

req.body.file

# Users EndPoints

## /users/register

#### POST

#### Required data

req.body = {
email: email formatted string,
firstName: string,
lastName: string,
password: string
}

#### Optional data

the remaining of editable properties of User, see User data shape

## /users/login

#### POST

#### Required data

req.body = {email: name@example.co, password: 'pass'}

#### Or

req.body = {id: number, password: 'pass'}

## /users/logout

#### POST

## /users/verify-email/:emailOrId

#### POST

#### Required data

req.params.emailOrId = 'email or Id'
req.body.verifyToken = 'email verification token'

## /users/reset-password-quest

#### POST

#### Required data

req.body.email = 'email formatted string'

## /users/reset-password/:emailOrId

#### POST

#### Required data

req.params.emailOrId = 'email or Id'
req.body.password = 'new password'
req.query.passToken = 'reset password token'

## /users/change-password/:emailOrId

#### POST

#### Authorization: Same User level

#### Required data

req.params.emailOrId = 'email or Id'
req.body.oldPassword = 'old password'
req.body.newPassword = 'new password'

## /users/index

#### GET

#### Authorization: Editor level

#### Optional data

req.query.page = number, default 1 (1-based, not 0-based)
req.query.limit = number, default 100 per page
req.query.sort['one/more property of user'] = 'asc || desc'
req.query['any property of user'] = value
req.query['any property of user'] = {gt: value, lt: value, ne: value}

#### Examples

?page=number&limit=50&sort[id]=asc&sort[firstName]=desc
?email[ne]='notwanted@email.com'&age[gt]=20&age[lt]=60&sendEmail=true

## /users/check/:emailOrId

#### GET

#### Required data

req.params.emailOrId = 'email or id'

## /users/:emailOrId

#### GET

#### Authorization: Same User level or Editors level

#### Required data

req.params.emailOrId = 'email or id'

## /users/:emailOrId

#### POST

#### Authorization: Same User level

#### Optional data

req.params.emailOrId = 'email or id'
req.body['one/more property of User'] = value

# Addresses EndPoints

## /users/addresses/index

#### GET

#### Authorization: Editors level

## /users/addresses/add

#### POST

#### Authorization: User level

## /users/addresses/:id

#### POST

#### Authorization: Same User level or Editors level

## /users/addresses/:id

#### GET

#### Authorization: Same User level or Editors level

# Products endpoints

## /products/index

#### GET

## /products/add

#### POST

#### Authorization: Editors level

## /products/:nameOrId

#### POST

#### Authorization: Editors level

## /products/:nameOrId

#### GET

# Orders endpoints

## /orders/index

#### GET

#### Authorization: Same user level or Editors level

## /orders/add

#### POST

#### Authorization: Users level

## /orders/:id

#### GET

#### Authorization: Same user level or editors level

# Order items endpoint

## /items/index

#### GET

#### Authorization: Same user level or editors level

## /items/:id

#### POST

#### Authorization: Same user level or editors level

## /items/:id

#### GET

#### Authorization: Same user level or editors level

# Packs endpoint

## /packs/index

#### GET

#### Authorization: Same user level or editors level

## /packs/add

#### POST

#### Authorization: editors level

## /packs/:id

#### POST

#### Authorization: editors level

## /packs/:id

#### GET

#### Authorization: Same user level

# Data Shapes

## User

firstName: string,
lastName: string,
phone: string,
age: number,
gender: string,
sendEmails: boolean,
addresses_ids: number[]
role: ['owner', 'admin', 'editor', service', 'user']
id: number,
email: string,
verifiedEmail: boolean,
signInDate: date,
signUpDate: date,
password: string,
verifyToken: string,
passToken: string,
passTokenExp: date

## Address

id: number,
user_id: number,
fullName: string,
phone: string,
state: string,
street: string,
buildingNo: string,
floor: string,
apartment: string,

## Product

id: number,
name: string,
description: string,
price: number,
salePrice: number,
stock: number, //number of pieces available
viewsCount: number, //number of views
ordersCount: number, //number of orders
used: false, //is it new or used
category: EnCategory.clothes,
size: Size.L,
color: Color.blue,
maxItems: number, //max number of items to be bought in one order
img1: string, //external url or local name
img2: string,
img3: string,
img4: string,
img5: string,
hidden: false,

## Order

//to be sent in order
user_id: number,
items_ids: number[],
packs_ids: number[],
payment: string, //CashOnDeliver vs Credit/Debit
fullName: string,
phone: string,
addressString: string, //can't be address id as the user can change the address after order
itemsCost: number,
shipCost: number,
items: <OrderItem[]>[OrderItemTemp] ,
packs: <Pack[]>[PackTemp],

//programmatically added
id: number,
date: date,

## Order Item

product_id: number,
quantity: number,
price: number, //buying price of one item

//programmatically added
id: number,
status: EnOrderStatus.approved,
user_id: number,
order_id: number,
deliveryDate: date,
pack_id: number, //when packed for delivery
serialNos: number[], //serial numbers for returning

## Pack

id: number,
order_id: number,
items_ids: number[],
status: EnOrderStatus.none, //when updated, items.status must update
weight: number,
ship_code: string,

## enum EnOrderStatus

ordered = 'ordered', // by client
cancelled = 'cancelled', // by client or seller
approved = 'approved', // by seller
approvedButShort = 'approvedButShort', //turned to be short
packed = 'packed', // packed in groups of items
carried = 'carried', // by transporter
delivered = 'delivered', // to client
completed = 'completed', // return period is over
returned = 'returned', //by client
none = 'none'
