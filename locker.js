const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const {Gio, GObject, St, Clutter} = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Password = Me.imports.passwordDialog;

var Locker = class Locker { 
	constructor() {
		this._lockerPanelButton = new LockerPanelMenuButton();
		this._inputMenu = new InputMenuItem();
		this._switchMenu = new SwitchMenuItem();
		this._buttonsMenu = new ButtonsMenuItem();
		this._build();
		this._controller()
	}

	destroy() {
		this._lockerPanelButton.destroy();
	}

	_build() {
		this._lockerPanelButton.menu.addMenuItem(this._switchMenu);
		this._lockerPanelButton.menu.addMenuItem(this._inputMenu);
		this._lockerPanelButton.menu.addMenuItem(this._buttonsMenu);
		Main.panel.addToStatusArea('LockerExtension', this._lockerPanelButton);
	}

	_controller() {
		this._lockerPanelButton.menu.connect(
			'open-state-changed', () => {
				this._inputMenu.passwordEntry.set_text("");
				this._buttonsMenu.generateButton.set_label('Generate');		
		});

		this._switchMenu.connect('toggled', item => {
			this._switchMenu.hasSpecialCharacters = item.state;
		});

		this._buttonsMenu.generateButton.connect(
			'button-press-event', () => {
				let password = this._generate_password(this._inputMenu.passwordEntry.get_text(), 
													   this._switchMenu.hasSpecialCharacters);
				this._inputMenu.passwordEntry.set_text(password);
				var buttonLabel = this._buttonsMenu.generateButton.get_label();
				var label = (buttonLabel === 'Reset') ? 'Generate' : 'Reset';
				this._buttonsMenu.generateButton.set_label(label);
		});

		this._inputMenu.copyButton.connect(
			'button-press-event', () => {
				St.Clipboard.get_default().set_text(St.ClipboardType.CLIPBOARD, 
													this._inputMenu.passwordEntry.get_text());
		});

		this._buttonsMenu.saveButton.connect(
			'button-press-event', () => {
				// TODO: Implement better handeling
				let passwordDialog = new Password.SaveDialog();
				passwordDialog.password = this._inputMenu.passwordEntry.get_text();
				passwordDialog.open();
		});
	}

    _generate_password(length, hasSpecialCharacters) {

        let lower = 'abcdefghijklmnopqrstuvwxyz';
        let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let numeric = '0123456789';
        let special = '$#@!%^&*()"'
        
        var max = (hasSpecialCharacters) ? 4 : 3;
        var password = "";
    
        length = (length == 0) ? 10 : length; 
    
        for (var i = 1; i <= length; ++i) {
            var section = Math.floor(Math.random() * max);
            switch(section) {
                case 0:
                    password += lower.charAt(Math.floor(Math.random() * (lower.length - 1)));
                    break;
                case 1:
                    password += upper.charAt(Math.floor(Math.random() * (upper.length - 1)));
                    break;
                case 2:
                    password += numeric.charAt(Math.floor(Math.random() * (numeric.length - 1)));
                    break;
                case 3:
                    password += special.charAt(Math.floor(Math.random() * (special.length - 1)));             
                    break;
            }
        }
        return password;
    }
}

var LockerPanelMenuButton = GObject.registerClass(
    class LockerPanelMenuButton extends PanelMenu.Button { 
		_init() {
			super._init(0, "LockerPanelButton");

			log(`enabling ${Me.metadata.name}`);    
			this._indicator = new PanelMenu.Button(0, "LockerPanelButton");
			this._icon = new St.Icon({
				style_class: 'system-status-icon',
				gicon: Gio.icon_new_for_string(`${Me.path}/icons/dialog-password-symbolic.svg`)
			});

			this.add_child(this._icon);
		}
});

var InputMenuItem = GObject.registerClass(
	class InputMenuItem extends PopupMenu.PopupBaseMenuItem {
		_init() {
			super._init({
				reactive: false,
				can_focus: false,
				style_class: 'custom-menu-item'
			});

			this.passwordEntry = new St.PasswordEntry({
				style_class: 'search-entry password-entry',
				can_focus: true
			});

			this.copyButton = new St.Button({
				style_class: 'copy-button button',
				label: _('Copy'),
				can_focus: true,
				x_expand: true,
				x_align: Clutter.ActorAlign.START,
			});

			this.copyIcon = new St.Icon({
				icon_name: 'edit-copy-symbolic',
				style_class: 'copy-button button'
			});

			//this.passwordEntry.set_secondary_icon(this.copyIcon);
			this.add_child(this.passwordEntry);
			this.add_child(this.copyButton);
		}
});

var SwitchMenuItem = GObject.registerClass(
	class SwitchMenuItem extends PopupMenu.PopupSwitchMenuItem {
		_init(){
			super._init("Special Characters", true);
			this.can_focus = true;
			this.hasSpecialCharacters = true;
		}
});

var ButtonsMenuItem = GObject.registerClass(
	class ButtonsMenuItem extends PopupMenu.PopupBaseMenuItem {
		_init(){ 
			super._init({
				reactive: false,
				can_focus: false,
				style_class: 'custom-menu-item'
			});

			this.generateButton = new St.Button({
				style_class: 'menu-item-button button',
				label: _('Generate'),
				can_focus: true,
				x_expand: true,
				x_align: Clutter.ActorAlign.START,
			});
			
			this.saveButton = new St.Button({
				style_class: 'menu-item-button button',
				label: _('Save'),
				can_focus: true,
				x_expand: true,
				x_align: Clutter.ActorAlign.START,
			});

			this.add_child(this.generateButton);
			this.add_child(this.saveButton);
		}
});
