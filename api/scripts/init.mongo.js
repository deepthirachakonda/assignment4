db.products.remove({});
const productDB = [
{
    Product_id:1,
    Product_name :'t-shirt',
    Category :shirt,
    Price : 20,
    Image : 'gthhh',
},
{
    Product_id:2,
    Product_name :'p-shirt',
    Category :shirt,
    Price : 30,
    Image : 'hhhhh',
    },
    ];
    db.products.insertMany(productDB);
    const count = db.products.count();
    print('Inserted', count, 'products');
    db.counters.remove({ _id: 'products' });
    db.counters.insert({ _id: 'products', current: count });
    db.products.createIndex({ id: 1 }, { unique: true });
    db.products.createIndex({ Product_name: 1 });
    db.products.createIndex({ Category: 1 });
    db.products.createIndex({ Price: 1 });
    db.products.createIndex({ Image: 1 });