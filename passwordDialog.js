const ModalDialog = imports.ui.modalDialog;
const Dialog = imports.ui.dialog;
const {Gio, GObject, St, Clutter} = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Keyring = Me.imports.keystore;


var SaveDialog = GObject.registerClass(
    class SaveDialog extends ModalDialog.ModalDialog { 
		_init() {
			super._init({
                styleClass: 'run-dialog',
                destroyOnClose: false,
            });
            this.password = null;
            let title = _('Save to Keyring');
            let content = new Dialog.MessageDialogContent({ title });
            this.contentLayout.add_actor(content);
            let defaultDescriptionText = _('Press ESC to close');

            this._descriptionLabel = new St.Label({
                style_class: 'run-dialog-description',
                text: defaultDescriptionText,
            });
            content.add_child(this._descriptionLabel);

            let serviceEntry = new St.Entry({
                style_class: 'run-dialog-entry',
                can_focus: true,
                hint_text: 'Service'
            });
            content.add_child(serviceEntry);


            let usernameEntry = new St.Entry({
                style_class: 'run-dialog-entry',
                can_focus: true,
                hint_text: 'Username'
            });
            content.add_child(usernameEntry);
        
            let saveButton = new St.Button({
                style_class: 'button',
				label: _('Save'),
				can_focus: true,
				x_expand: true,
				x_align: Clutter.ActorAlign.START,
            });

            let cancelButton = new St.Button({
                style_class: 'message-list-clear-button button',
				label: _('Cancel'),
				can_focus: true,
				x_expand: true,
				x_align: Clutter.ActorAlign.START,
            });

            let hbox = new St.BoxLayout({ style_class: 'testing' });
            hbox.add_child(saveButton);
            hbox.add_child(cancelButton);
            content.add_child(hbox);
            

            cancelButton.connect('button-press-event', () => {
                this.close();
                serviceEntry.set_text("");
                usernameEntry.set_text("");
	    	});

            saveButton.connect('button-press-event', () => {
                let keystore = new Keyring.Keystore(serviceEntry.get_text(), 
                                                    usernameEntry.get_text(), 
                                                    this.password);
                keystore.storePassword();
                serviceEntry.set_text("");
                usernameEntry.set_text("");
				this.close();
	    	});
        }
    });