const Secret = imports.gi.Secret;
const GObject = imports.gi.GObject;

const LOCKER_SCHEMA = new Secret.Schema("org.Test.Locker",
    Secret.SchemaFlags.NONE,
    {
        "application": Secret.SchemaAttributeType.STRING,
        "service": Secret.SchemaAttributeType.STRING,
        "username": Secret.SchemaAttributeType.STRING,
    }
    
);

var Keystore = GObject.registerClass({
    Signals: {
        'on-password-stored': {},
    },
}, class Keystore extends GObject.Object {
        async storePassword(service, username, password) {
            this._attributes = {
                "application": "Locker Extension",
                "service": service,
                "username": username,
            }

            let label = username + "::" + service;
            await Secret.password_store(LOCKER_SCHEMA, this._attributes, Secret.COLLECTION_DEFAULT, 
                                        label, password, null, this._onPasswordStored);
        }  

        _onPasswordStored(source, result) {
            Secret.password_store_finish(result);
        }
});
