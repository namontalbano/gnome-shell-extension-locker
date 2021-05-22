const Secret = imports.gi.Secret;

const LOCKER_SCHEMA = new Secret.Schema("org.Test.Locker",
    Secret.SchemaFlags.NONE,
    {
        "application": Secret.SchemaAttributeType.STRING,
        "service": Secret.SchemaAttributeType.STRING,
        "username": Secret.SchemaAttributeType.STRING,
    }
    
);

var Keystore = class Keystore {
    constructor(service, username, password) {
        log(username);
        this._username = username;
        this._service = service;
        this._password = password;
        this._attributes = {
            "application": "Locker Extension",
            "service": this._service,
            "username": this._username,
        }
    }
    
    storePassword() {
        let label = this._username + "::" + this._service;
        Secret.password_store(LOCKER_SCHEMA, this._attributes, Secret.COLLECTION_DEFAULT, 
                            label, this._password, null, this.onPasswordStored);
    }
    
    onPasswordStored(source, result) {
        Secret.password_store_finish(result);
        log('Password stored');
        this._password = null;
        this._username = null;
    }
}




