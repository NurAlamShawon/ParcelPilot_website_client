📌 Project Overview
ParcelPilot is a web-based courier tracking and parcel management system designed to simplify parcel delivery operations. <br>
The frontend is built using modern React practices with role-based interfaces for Admin, Customer, and Delivery Agents (Riders). <br>

🧩 Features (Client Side)
👤 Customer <br>
• Register/Login with JWT-based auth <br>
• Send parcel form with pickup & delivery info <br>
• Prepaid parcel booking using Stripe <br>
• View and track booked parcels <br>
• See payment and transaction history <br>

🚴 Rider <br>
• Apply as a delivery agent <br>
• Login with role-based dashboard <br>
• View assigned deliveries <br>
• Update parcel status (Picked, In Transit, Delivered) <br>
• View earnings & completed deliveries <br>

🛠️ Admin <br>
• Dashboard with key metrics (bookings, earnings, delivery status) <br>
• Approve/reject rider applications <br>
• Assign riders to parcels <br>
• Manage users and bookings <br>

🛠 Tech Stack
• React.js + React Router DOM <br>
• Tailwind CSS + DaisyUI <br>
• Context API for global state <br>
• TanStack React Query for data caching <br>
• Stripe.js for payment integration <br>
• Leaflet.js for map tracking <br>



🔄 Workflows
• 👤 User Workflow
Users log in using their email and password. <br>
After logging in, they can access and complete the "Send Parcel" form. <br>
To proceed, they must complete a prepaid payment via Stripe. <br>
Once payment is successful, users can view their transaction history and track parcel status in real-time. <br>

• 🚴 Rider Workflow
Riders initially log in as regular users and submit the Rider Application Form. <br>
Upon approval by the admin, they are upgraded to a rider account. <br>
Approved riders can view assigned parcels, update parcel statuses (Picked, In Transit, Delivered), view their earnings, and monitor completed deliveries. <br>

• 👨‍💼 Admin Workflow
Admins log in using their credentials. <br>
They can manage rider applications by approving or rejecting them. <br>
Admins are responsible for assigning riders to parcels based on delivery districts. <br>
The dashboard displays key metrics such as: <br>
• Total Deliveries <br>
• Pending Deliveries <br>
• Pending Rider Requests <br>
Admins can also manage users, view bookings, and monitor system performance. <br>

Role	Email	Password<br>
Admin	hasanmuhammad5588@gmail.com	Hasan1234<br>
Rider	kasemmia5588@gmail.com	Kasem1234<br>
User	mitulhasan910@gmail.com	Mitul1234<br>
