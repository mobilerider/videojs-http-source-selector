import videojs from 'video.js';
import SourceMenuItem from './SourceMenuItem';

const MenuButton = videojs.getComponent('MenuButton');

class SourceMenuButton extends MenuButton {
  constructor(player, options) {
    super(player, options);
    this.controlText('Quality Picker');

    const qualityLevels = this.player().qualityLevels();

    // Handle options: We accept an options.default value of ( high || low )
    if (options && options.default) {
      if (options.default === 'low') {
        for (let i = 0; i < qualityLevels.length; i++) {
          qualityLevels[i].enabled = (i === 0);
        }
      } else if (options.default === 'high') {
        for (let i = 0; i < qualityLevels.length; i++) {
          qualityLevels[i].enabled = (i === qualityLevels.length - 1);
        }
      }
    }

    this.player().qualityLevels().on(['change', 'addqualitylevel'], videojs.bind(this, this.update));
  }

  createEl() {
    return videojs.dom.createEl('div', {
      className: 'vjs-http-source-selector vjs-menu-button vjs-menu-button-popup vjs-control vjs-button'
    });
  }

  buildCSSClass() {
    return super.buildCSSClass() + ' vjs-icon-cog';
  }

  update() {
    return super.update();
  }

  createItems() {
    const menuItems = [];
    const levels = this.player().qualityLevels();
    const labels = [];

    for (let i = 0; i < levels.length; i++) {
      const index = levels.length - (i + 1);
      const selected = (index === levels.selectedIndex);

      let label = `${index}`;
      let sortVal = index;

      if (levels[index].height) {
        label = `${levels[index].height}p`;
        sortVal = parseInt(levels[index].height, 10);
      } else if (levels[index].bitrate) {
        label = `${Math.floor(levels[index].bitrate / 1e3)} kbps`;
        sortVal = parseInt(levels[index].bitrate, 10);
      }

      if (labels.indexOf(label) >= 0) {
        continue;
      }
      labels.push(label);

      menuItems.push(new SourceMenuItem(this.player_, { label, index, selected, sortVal }));
    }

    if (levels.length > 1) {
      menuItems.push(new SourceMenuItem(this.player_, {
        label: 'Auto',
        index: levels.length,
        selected: false,
        sortVal: 99999
      }));
    }

    menuItems.sort((a, b) => {
      if (a.options_.sortVal < b.options_.sortVal) {
        return 1;
      } else if (a.options_.sortVal > b.options_.sortVal) {
        return -1;
      } else {
        return 0;
      }
    });

    return menuItems;
  }

  handleLanguagechange() {
  }
}

export default SourceMenuButton;
