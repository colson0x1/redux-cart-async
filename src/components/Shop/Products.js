import ProductItem from './ProductItem';
import classes from './Products.module.css';

const DUMMY_PRODUCTS = [
  {
    id: 'p1',
    price: 600000,
    title: 'Range Rover',
    description: 'When networth is more than 2 million dollars',
  },
  {
    id: 'p2',
    price: 300000,
    title: 'Toyota Fortuner',
    description: 'When networth is more than 1 million dollars',
  },
  {
    id: 'p3',
    price: 7000,
    title: 'MacBook Pro Powerhouse',
    description: 'When networth is 100,000',
  },
];

const Products = (props) => {
  return (
    <section className={classes.products}>
      <h2>Buy your favorite products</h2>
      <ul>
        {DUMMY_PRODUCTS.map((product) => (
          <ProductItem
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            description={product.des}
          />
        ))}
      </ul>
    </section>
  );
};

export default Products;
