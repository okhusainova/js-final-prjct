import Component from '../../component.js';
import PhoneCatalog from './phone-catalog.js';
import PhoneService from '../services/phone-service.js';

export default class PhoneFilters extends Component {
  constructor({ element }) {
    super({ element });

    this._render();

    this._on('change', 'sort', this._change.bind(this));
  }


    _change(ev) {
      console.log(123);
      this.emit('sort', ev.target.value);
  }


  _render() {
  this._element.innerHTML = `
    <p>
      Search:
      <input
        type="text"
      >
    </p>

    <p>
      Sort by:
      <select data-element="sort">
        <option value="name">Alphabetical</option>
        <option value="age">Newest</option>
      </select>
    </p>
  `;
}
}
