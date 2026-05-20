import Barang from './Barang';

export default interface CartItem extends Barang {
  quantity: number;
}
