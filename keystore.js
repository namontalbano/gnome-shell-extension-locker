const Secret = imports.gi.Secret;
const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;

const LOCKER_SCHEMA = new Secret.Schema("org.gnome.locker.extension",
    Secret.SchemaFlags.NONE,
    {
        "application": Secret.SchemaAttributeType.STRING,
        "service": Secret.SchemaAttributeType.STRING,
        "username": Secret.SchemaAttributeType.STRING,
    }
    
);

Gio._promisify(Secret, 'password_store', 'password_store_finish');

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

            let label = service + "::" + username;
            return await Secret.password_store(LOCKER_SCHEMA, this._attributes, Secret.COLLECTION_DEFAULT, 
                                        label, password, null, null);
        }  
});
