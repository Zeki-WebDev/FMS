const supabase = require('../config/supabase');

// Turn a Supabase error into a normal Error the error handler understands.
function unwrap({ data, error }) {
  if (error) throw Object.assign(new Error(error.message), { status: 500 });
  return data;
}

exports.list = async (userId) =>
  unwrap(await supabase.from('orders').select('*')
    .eq('user_id', userId).order('created_at', { ascending: false }));

exports.create = async (userId, { customer, product, amount }) =>
  unwrap(await supabase.from('orders')
    .insert({ user_id: userId, customer, product, amount })
    .select().single());

exports.remove = async (userId, id) => {
  const rows = unwrap(await supabase.from('orders').delete()
    .eq('id', id).eq('user_id', userId).select('id'));
  if (!rows.length) throw Object.assign(new Error('Order not found'), { status: 404 });
};

exports.stats = async (userId) => {
  const rows = unwrap(await supabase.from('orders')
    .select('product, amount').eq('user_id', userId));
  const byProduct = {};
  let revenue = 0;
  for (const r of rows) {
    const amt = Number(r.amount);
    revenue += amt;
    byProduct[r.product] = (byProduct[r.product] || 0) + amt;
  }
  return {
    totalOrders: rows.length,
    revenue,
    average: rows.length ? revenue / rows.length : 0,
    byProduct
  };
};
