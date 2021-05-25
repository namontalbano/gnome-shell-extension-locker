const ModalDialog = imports.ui.modalDialog;
const Dialog = imports.ui.dialog;
const {Gio, GObject, St, Clutter} = imports.gi;
const Secret = imports.gi.Secret;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Keyring = Me.imports.keystore;


var SaveDialog = GObject.registerClass(
    class SaveDialog extends ModalDialog.ModalDialog { 
		_init() {
			super._init({
                styleClass: 'save-dialog',
                destroyOnClose: true,
            });
            this._keystore = new Keyring.Keystore();
            this.password = null;
            let title = _('Save to Keyring');
            let content = new Dialog.MessageDialogContent({ title });
            this.contentLayout.add_actor(content);

            let serviceEntry = new St.Entry({
                style_class: 'keystore-entry',
                can_focus: true,
                hint_text: 'Service'
            });
            content.add_child(serviceEntry);


            let usernameEntry = new St.Entry({
                style_class: 'keystore-entry',
                can_focus: true,
                hint_text: 'Username'
            });
            content.add_child(usernameEntry);
        
            let saveButton = new St.Button({
                style_class: 'save-dialog-button button',
				label: _('Save'),
				can_focus: true,
				x_expand: true,
				x_align: Clutter.ActorAlign.CENTER,
            });

            let cancelButton = new St.Button({
                style_class: 'save-dialog-button button',
				label: _('Cancel'),
				can_focus: true,
				x_expand: true,
				x_align: Clutter.ActorAlign.CENTER,
            });

            let hbox = new St.BoxLayout({ style_class: 'keystore-button-hbox' });
            hbox.add_child(saveButton);
            hbox.add_child(cancelButton);
            content.add_child(hbox);
            

            cancelButton.connect('button-press-event', () => {
                this.close();
                serviceEntry.set_text("");
                usernameEntry.set_text("");
	    	});

            saveButton.connect('button-press-event', () => {
                this._keystore.storePassword(serviceEntry.get_text(), usernameEntry.get_text(), this.password)
                this.close();
                serviceEntry.set_text("");
                usernameEntry.set_text("");     
                this.password = null;
	    	});
        }
});
