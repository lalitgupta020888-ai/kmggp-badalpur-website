import OrdersEditor from '@/components/admin/sections/OrdersEditor';
import { getOrders } from '@/lib/server/content';

export const metadata = { title: 'Orders & Circulars' };

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <>
      <div className="admin-card mb-4">
        <div className="admin-card-head">
          <i className="bi bi-file-earmark-pdf-fill head-icon" />
          <div>
            <h2>Orders, Circulars &amp; Documents</h2>
            <p>The downloadable files listed on /notices</p>
          </div>
        </div>
        <div className="admin-card-body">
          <p className="mb-0 text-muted" style={{ fontSize: '0.88rem' }}>
            Upload the PDF here and it is stored with the site — you do not need to put the file
            anywhere else first. An entry without a file attached is dropped when you save, so nothing
            on the site can link to a document that is not there.
          </p>
        </div>
      </div>

      <OrdersEditor initial={orders} />
    </>
  );
}
