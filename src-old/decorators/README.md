# Unete-X decorators

 - ***Class Decorators***
	 - [x] **remote:** Exposes this class to the API. Client will be able to `create`  and `fetch` instances of this class
	 - [ ] **signed:** Signs the data with a random generated `JWT_SECRET`, ensures the client/server data integrity.
 - ***Method Decorators***
	 - [x] **hidden:** Client wont be able to `call` this function
 - ***Property Decorators***
	 - [x] **hidden:** Client wont be able to `get` or `set` this property
	 - [x] **locked:** Client wont be able to `set` this property value
	 - [x] **sync:** Client's data will be synchronized with backend
