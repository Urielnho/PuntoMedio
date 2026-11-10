-- PuntoMedio showcase dataset. Idempotent and intentionally synthetic.
-- The reserved .test domain prevents accidental delivery to real inboxes.

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  is_sso_user, is_anonymous
) values
  ('00000000-0000-0000-0000-000000000000','10000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'sofia.alcantara@puntomedio.test', extensions.crypt('Punto2026', extensions.gen_salt('bf')), now() - interval '120 days', '{"provider":"email","providers":["email"]}', '{}', now() - interval '120 days', now(), false, false),
  ('00000000-0000-0000-0000-000000000000','10000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'gael.montemayor@puntomedio.test', extensions.crypt('Punto2026', extensions.gen_salt('bf')), now() - interval '105 days', '{"provider":"email","providers":["email"]}', '{}', now() - interval '105 days', now(), false, false),
  ('00000000-0000-0000-0000-000000000000','10000000-0000-4000-8000-000000000003', 'authenticated', 'authenticated', 'renata.esquivel@puntomedio.test', extensions.crypt('Punto2026', extensions.gen_salt('bf')), now() - interval '92 days', '{"provider":"email","providers":["email"]}', '{}', now() - interval '92 days', now(), false, false),
  ('00000000-0000-0000-0000-000000000000','10000000-0000-4000-8000-000000000004', 'authenticated', 'authenticated', 'iker.valdes@puntomedio.test', extensions.crypt('Punto2026', extensions.gen_salt('bf')), now() - interval '76 days', '{"provider":"email","providers":["email"]}', '{}', now() - interval '76 days', now(), false, false),
  ('00000000-0000-0000-0000-000000000000','10000000-0000-4000-8000-000000000005', 'authenticated', 'authenticated', 'amalia.zuniga@puntomedio.test', extensions.crypt('Punto2026', extensions.gen_salt('bf')), now() - interval '64 days', '{"provider":"email","providers":["email"]}', '{}', now() - interval '64 days', now(), false, false)
on conflict (id) do update set instance_id=excluded.instance_id, email=excluded.email, encrypted_password=excluded.encrypted_password, updated_at=now();

update auth.users set
  confirmation_token = coalesce(confirmation_token, ''),
  recovery_token = coalesce(recovery_token, ''),
  email_change_token_new = coalesce(email_change_token_new, ''),
  email_change = coalesce(email_change, ''),
  email_change_token_current = coalesce(email_change_token_current, ''),
  phone_change = coalesce(phone_change, ''),
  phone_change_token = coalesce(phone_change_token, ''),
  reauthentication_token = coalesce(reauthentication_token, '')
where id in (
  '10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000002',
  '10000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000004',
  '10000000-0000-4000-8000-000000000005'
);

insert into auth.identities (id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at) values
  ('11000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '{"sub":"10000000-0000-4000-8000-000000000001","email":"sofia.alcantara@puntomedio.test","email_verified":true,"phone_verified":false}', 'email', now(), now()-interval '120 days', now()),
  ('11000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', '{"sub":"10000000-0000-4000-8000-000000000002","email":"gael.montemayor@puntomedio.test","email_verified":true,"phone_verified":false}', 'email', now(), now()-interval '105 days', now()),
  ('11000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000003', '{"sub":"10000000-0000-4000-8000-000000000003","email":"renata.esquivel@puntomedio.test","email_verified":true,"phone_verified":false}', 'email', now(), now()-interval '92 days', now()),
  ('11000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000004', '{"sub":"10000000-0000-4000-8000-000000000004","email":"iker.valdes@puntomedio.test","email_verified":true,"phone_verified":false}', 'email', now(), now()-interval '76 days', now()),
  ('11000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000005', '{"sub":"10000000-0000-4000-8000-000000000005","email":"amalia.zuniga@puntomedio.test","email_verified":true,"phone_verified":false}', 'email', now(), now()-interval '64 days', now())
on conflict (id) do update set provider_id=excluded.provider_id, user_id=excluded.user_id, identity_data=excluded.identity_data, updated_at=now();

insert into public.profiles (
  id, display_name, city, phone_verified, email_verified,
  terms_accepted_at, privacy_accepted_at, status,
  completed_services, rating_average, rating_count, created_at
) values
  ('10000000-0000-4000-8000-000000000001', 'Sofía Alcántara Vélez', 'Phoenix', true, true, now() - interval '119 days', now() - interval '119 days', 'complete', 18, 4.86, 14, now() - interval '120 days'),
  ('10000000-0000-4000-8000-000000000002', 'Gael Montemayor Ríos', 'Tempe', true, true, now() - interval '104 days', now() - interval '104 days', 'complete', 31, 4.92, 25, now() - interval '105 days'),
  ('10000000-0000-4000-8000-000000000003', 'Renata Esquivel Soria', 'Scottsdale', true, true, now() - interval '91 days', now() - interval '91 days', 'complete', 12, 4.75, 8, now() - interval '92 days'),
  ('10000000-0000-4000-8000-000000000004', 'Iker Valdés Armenta', 'Mesa', true, true, now() - interval '75 days', now() - interval '75 days', 'complete', 9, 4.67, 6, now() - interval '76 days'),
  ('10000000-0000-4000-8000-000000000005', 'Amalia Zúñiga Ferrer', 'Phoenix', true, true, now() - interval '63 days', now() - interval '63 days', 'complete', 22, 4.95, 19, now() - interval '64 days')
on conflict (id) do update set
  display_name = excluded.display_name, city = excluded.city,
  phone_verified = excluded.phone_verified, email_verified = excluded.email_verified,
  terms_accepted_at = excluded.terms_accepted_at, privacy_accepted_at = excluded.privacy_accepted_at,
  status = excluded.status, completed_services = excluded.completed_services,
  rating_average = excluded.rating_average, rating_count = excluded.rating_count;

update public.profiles set completed_services = 7, rating_average = 4.80, rating_count = 5 where id = 'c46db2af-a02b-4cc8-9ec4-bae578a84e3c';

insert into public.courier_profiles (user_id, enabled, rules_accepted_at) values
  ('c46db2af-a02b-4cc8-9ec4-bae578a84e3c', true, now() - interval '30 days'),
  ('10000000-0000-4000-8000-000000000002', true, now() - interval '100 days'),
  ('10000000-0000-4000-8000-000000000004', true, now() - interval '70 days'),
  ('10000000-0000-4000-8000-000000000005', true, now() - interval '60 days')
on conflict (user_id) do update set enabled = excluded.enabled, rules_accepted_at = excluded.rules_accepted_at, suspended_at = null;

insert into public.meeting_points (id, name, category, address_label, latitude, longitude, city, active) values
  ('20000000-0000-4000-8000-000000000001', 'Burton Barr Central Library', 'Biblioteca pública', '1221 N Central Ave, Phoenix, AZ', 33.462800, -112.073900, 'Phoenix', true),
  ('20000000-0000-4000-8000-000000000002', 'Japanese Friendship Garden', 'Jardín público', '1125 N 3rd Ave, Phoenix, AZ', 33.460900, -112.077400, 'Phoenix', true),
  ('20000000-0000-4000-8000-000000000003', 'Tempe Marketplace', 'Centro comercial', '2000 E Rio Salado Pkwy, Tempe, AZ', 33.432600, -111.904200, 'Tempe', true),
  ('20000000-0000-4000-8000-000000000004', 'Scottsdale Civic Center', 'Plaza pública', '3939 N Drinkwater Blvd, Scottsdale, AZ', 33.492800, -111.922900, 'Scottsdale', true),
  ('20000000-0000-4000-8000-000000000005', 'Mesa Arts Center', 'Centro cultural', '1 E Main St, Mesa, AZ', 33.414900, -111.831500, 'Mesa', true),
  ('20000000-0000-4000-8000-000000000006', 'Desert Ridge Marketplace', 'Centro comercial', '21001 N Tatum Blvd, Phoenix, AZ', 33.676500, -111.974400, 'Phoenix', true)
on conflict (id) do update set name=excluded.name, category=excluded.category, address_label=excluded.address_label, latitude=excluded.latitude, longitude=excluded.longitude, city=excluded.city, active=true;

insert into public.meetings (id, creator_id, title, status, selected_point_id, revision, created_at, updated_at) values
  ('30000000-0000-4000-8000-000000000001', 'c46db2af-a02b-4cc8-9ec4-bae578a84e3c', 'Entrega de cámara analógica', 'completed', '20000000-0000-4000-8000-000000000001', 5, now() - interval '22 days', now() - interval '21 days'),
  ('30000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000003', 'Intercambio de colección editorial', 'in_progress', '20000000-0000-4000-8000-000000000002', 4, now() - interval '5 hours', now() - interval '18 minutes'),
  ('30000000-0000-4000-8000-000000000003', 'c46db2af-a02b-4cc8-9ec4-bae578a84e3c', 'Revisión de prototipo universitario', 'point_selected', '20000000-0000-4000-8000-000000000003', 3, now() - interval '1 day', now() - interval '2 hours'),
  ('30000000-0000-4000-8000-000000000004', 'c46db2af-a02b-4cc8-9ec4-bae578a84e3c', 'Recoger documentación certificada', 'invited', null, 1, now() - interval '40 minutes', now() - interval '40 minutes')
on conflict (id) do update set title=excluded.title, status=excluded.status, selected_point_id=excluded.selected_point_id, revision=excluded.revision, updated_at=excluded.updated_at;

insert into public.meeting_participants (meeting_id, user_id, status, accepted_point_at, arrived_at, completed_at, created_at, updated_at) values
  ('30000000-0000-4000-8000-000000000001', 'c46db2af-a02b-4cc8-9ec4-bae578a84e3c', 'accepted', now()-interval '21 days 3 hours', now()-interval '21 days 1 hour', now()-interval '21 days', now()-interval '22 days', now()-interval '21 days'),
  ('30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'accepted', now()-interval '21 days 3 hours', now()-interval '21 days 1 hour', now()-interval '21 days', now()-interval '22 days', now()-interval '21 days'),
  ('30000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000003', 'accepted', now()-interval '3 hours', now()-interval '20 minutes', null, now()-interval '5 hours', now()-interval '18 minutes'),
  ('30000000-0000-4000-8000-000000000002', 'c46db2af-a02b-4cc8-9ec4-bae578a84e3c', 'accepted', now()-interval '3 hours', now()-interval '15 minutes', null, now()-interval '5 hours', now()-interval '15 minutes'),
  ('30000000-0000-4000-8000-000000000003', 'c46db2af-a02b-4cc8-9ec4-bae578a84e3c', 'accepted', now()-interval '4 hours', null, null, now()-interval '1 day', now()-interval '2 hours'),
  ('30000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000004', 'accepted', now()-interval '3 hours', null, null, now()-interval '20 hours', now()-interval '2 hours'),
  ('30000000-0000-4000-8000-000000000004', 'c46db2af-a02b-4cc8-9ec4-bae578a84e3c', 'accepted', null, null, null, now()-interval '40 minutes', now()-interval '40 minutes')
on conflict (meeting_id,user_id) do update set status=excluded.status, accepted_point_at=excluded.accepted_point_at, arrived_at=excluded.arrived_at, completed_at=excluded.completed_at, updated_at=excluded.updated_at;

insert into public.meeting_point_suggestions (meeting_id, point_id, rank, method, participant_one_distance_m, participant_two_distance_m, participant_one_duration_s, participant_two_duration_s) values
  ('30000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000002',1,'route',2100,2400,420,480),
  ('30000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000001',2,'route',3100,2800,600,540),
  ('30000000-0000-4000-8000-000000000003','20000000-0000-4000-8000-000000000003',1,'route',11400,3900,960,510),
  ('30000000-0000-4000-8000-000000000003','20000000-0000-4000-8000-000000000005',2,'route',26800,7400,1740,720)
on conflict (meeting_id,point_id) do update set rank=excluded.rank, method=excluded.method, participant_one_distance_m=excluded.participant_one_distance_m, participant_two_distance_m=excluded.participant_two_distance_m, participant_one_duration_s=excluded.participant_one_duration_s, participant_two_duration_s=excluded.participant_two_duration_s;

insert into public.jobs (id, requester_id, title, description, category, declared_product_value_minor, product_payment_status, pickup_label, delivery_label, status, revision, created_at, updated_at) values
  ('40000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','Traslado de sintetizador compacto','Recoger un sintetizador de 49 teclas dentro de su estuche rígido y entregarlo sin inclinarlo.','Instrumentos',1850000,'declared_paid','Roosevelt Row, Phoenix','Arcadia Lite, Phoenix','published',0,now()-interval '35 minutes',now()-interval '35 minutes'),
  ('40000000-0000-4000-8000-000000000002','c46db2af-a02b-4cc8-9ec4-bae578a84e3c','Entrega de maqueta arquitectónica','La maqueta está protegida en una caja de 60 × 45 cm. Debe viajar sobre una superficie plana.','Proyectos',320000,'awaiting_confirmation','Downtown Phoenix','ASU Tempe Campus','bidding',2,now()-interval '3 hours',now()-interval '24 minutes'),
  ('40000000-0000-4000-8000-000000000003','c46db2af-a02b-4cc8-9ec4-bae578a84e3c','Recoger edición de fotografía urbana','Paquete editorial reservado; solicitarlo a nombre del titular y conservar el recibo.','Libros',145000,'declared_paid','Changing Hands Bookstore, Phoenix','Encanto Village, Phoenix','assigned',3,now()-interval '1 day',now()-interval '4 hours'),
  ('40000000-0000-4000-8000-000000000004','10000000-0000-4000-8000-000000000003','Entrega de vestuario escénico','Dos fundas de vestuario etiquetadas. Evitar doblarlas y confirmar cada pieza al recoger.','Vestuario',780000,'declared_paid','Old Town Scottsdale','Mesa Arts Center','pickup_in_progress',5,now()-interval '8 hours',now()-interval '12 minutes'),
  ('40000000-0000-4000-8000-000000000005','c46db2af-a02b-4cc8-9ec4-bae578a84e3c','Traslado de lente cinematográfico','Lente dentro de maletín acolchado con sello de seguridad. Entrega contra código.','Fotografía',2400000,'declared_paid','Biltmore Fashion Park','Desert Ridge, Phoenix','completed',9,now()-interval '17 days',now()-interval '16 days'),
  ('40000000-0000-4000-8000-000000000006','10000000-0000-4000-8000-000000000004','Recoger impresiones de exposición','Tres carpetas rígidas tamaño A2 listas en mostrador. Mantenerlas secas y planas.','Arte',460000,'declared_paid','Mesa Arts Center','Scottsdale Civic Center','completed',8,now()-interval '11 days',now()-interval '10 days')
on conflict (id) do update set title=excluded.title, description=excluded.description, category=excluded.category, declared_product_value_minor=excluded.declared_product_value_minor, product_payment_status=excluded.product_payment_status, pickup_label=excluded.pickup_label, delivery_label=excluded.delivery_label, status=excluded.status, revision=excluded.revision, updated_at=excluded.updated_at;

insert into private.job_locations (job_id,pickup_latitude,pickup_longitude,delivery_latitude,delivery_longitude,pickup_private_note,delivery_private_note) values
  ('40000000-0000-4000-8000-000000000001',33.458100,-112.070700,33.495200,-111.998000,'Preguntar por Sofía en recepción.','Entregar personalmente a Valeria.'),
  ('40000000-0000-4000-8000-000000000002',33.448400,-112.074000,33.421500,-111.933200,'Caja marcada PM-27.','Acceso por pabellón de diseño.'),
  ('40000000-0000-4000-8000-000000000003',33.510300,-112.027500,33.479100,-112.088800,'Mostrar número de reserva.','Llamar al llegar al vestíbulo.'),
  ('40000000-0000-4000-8000-000000000004',33.494200,-111.926100,33.414900,-111.831500,'Solicitar inventario firmado.','Entrada de artistas por Main St.'),
  ('40000000-0000-4000-8000-000000000005',33.510600,-112.028500,33.676500,-111.974400,'Verificar sello azul.','Entrega en estudio 4.'),
  ('40000000-0000-4000-8000-000000000006',33.414900,-111.831500,33.492800,-111.922900,'Carpetas en archivo gráfico.','Recepción de exposiciones.')
on conflict (job_id) do update set pickup_latitude=excluded.pickup_latitude,pickup_longitude=excluded.pickup_longitude,delivery_latitude=excluded.delivery_latitude,delivery_longitude=excluded.delivery_longitude,pickup_private_note=excluded.pickup_private_note,delivery_private_note=excluded.delivery_private_note;

insert into public.bids (id,job_id,courier_id,proposed_fee_minor,note,status,created_at) values
  ('50000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002',28500,'Tengo plataforma plana y protección antideslizante.','active',now()-interval '90 minutes'),
  ('50000000-0000-4000-8000-000000000002','40000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000004',26000,'Puedo recoger después de las 17:00.','active',now()-interval '55 minutes'),
  ('50000000-0000-4000-8000-000000000003','40000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000002',18000,'Ruta directa y entrega con fotografía.','accepted',now()-interval '20 hours'),
  ('50000000-0000-4000-8000-000000000004','40000000-0000-4000-8000-000000000004','c46db2af-a02b-4cc8-9ec4-bae578a84e3c',34000,'Cuento con espacio para transportar las fundas extendidas.','accepted',now()-interval '7 hours'),
  ('50000000-0000-4000-8000-000000000005','40000000-0000-4000-8000-000000000005','10000000-0000-4000-8000-000000000005',22000,'Maletín asegurado durante todo el trayecto.','accepted',now()-interval '17 days'),
  ('50000000-0000-4000-8000-000000000006','40000000-0000-4000-8000-000000000006','c46db2af-a02b-4cc8-9ec4-bae578a84e3c',19500,'Traslado plano en vehículo cerrado.','accepted',now()-interval '11 days')
on conflict (id) do update set proposed_fee_minor=excluded.proposed_fee_minor,note=excluded.note,status=excluded.status;

insert into public.job_assignments (job_id,bid_id,courier_id,assigned_by,assigned_at) values
  ('40000000-0000-4000-8000-000000000003','50000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000002','c46db2af-a02b-4cc8-9ec4-bae578a84e3c',now()-interval '18 hours'),
  ('40000000-0000-4000-8000-000000000004','50000000-0000-4000-8000-000000000004','c46db2af-a02b-4cc8-9ec4-bae578a84e3c','10000000-0000-4000-8000-000000000003',now()-interval '6 hours'),
  ('40000000-0000-4000-8000-000000000005','50000000-0000-4000-8000-000000000005','10000000-0000-4000-8000-000000000005','c46db2af-a02b-4cc8-9ec4-bae578a84e3c',now()-interval '17 days'),
  ('40000000-0000-4000-8000-000000000006','50000000-0000-4000-8000-000000000006','c46db2af-a02b-4cc8-9ec4-bae578a84e3c','10000000-0000-4000-8000-000000000004',now()-interval '11 days')
on conflict (job_id) do update set bid_id=excluded.bid_id,courier_id=excluded.courier_id,assigned_by=excluded.assigned_by,assigned_at=excluded.assigned_at;

insert into public.conversations (id,service_kind,meeting_id,job_id,created_at) values
  ('60000000-0000-4000-8000-000000000005','meeting','30000000-0000-4000-8000-000000000001',null,now()-interval '22 days'),
  ('60000000-0000-4000-8000-000000000001','meeting','30000000-0000-4000-8000-000000000002',null,now()-interval '5 hours'),
  ('60000000-0000-4000-8000-000000000002','meeting','30000000-0000-4000-8000-000000000003',null,now()-interval '1 day'),
  ('60000000-0000-4000-8000-000000000003','job',null,'40000000-0000-4000-8000-000000000003',now()-interval '18 hours'),
  ('60000000-0000-4000-8000-000000000004','job',null,'40000000-0000-4000-8000-000000000004',now()-interval '6 hours')
on conflict (id) do nothing;

insert into public.messages (id,conversation_id,sender_id,body,created_at) values
  ('70000000-0000-4000-8000-000000000008','60000000-0000-4000-8000-000000000005','10000000-0000-4000-8000-000000000001','Estoy frente al acceso principal de la biblioteca.',now()-interval '21 days 1 hour 15 minutes'),
  ('70000000-0000-4000-8000-000000000009','60000000-0000-4000-8000-000000000005','c46db2af-a02b-4cc8-9ec4-bae578a84e3c','Te veo. Llevo el estuche negro con la cámara.',now()-interval '21 days 1 hour 10 minutes'),
  ('70000000-0000-4000-8000-000000000001','60000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000003','Ya estoy junto a la entrada norte del jardín.',now()-interval '24 minutes'),
  ('70000000-0000-4000-8000-000000000002','60000000-0000-4000-8000-000000000001','c46db2af-a02b-4cc8-9ec4-bae578a84e3c','Perfecto, llego en aproximadamente cinco minutos.',now()-interval '21 minutes'),
  ('70000000-0000-4000-8000-000000000003','60000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000004','El acceso más sencillo es por Rio Salado Parkway.',now()-interval '3 hours'),
  ('70000000-0000-4000-8000-000000000004','60000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000002','Confirmo que puedo recoger la edición a las 16:30.',now()-interval '4 hours'),
  ('70000000-0000-4000-8000-000000000005','60000000-0000-4000-8000-000000000003','c46db2af-a02b-4cc8-9ec4-bae578a84e3c','De acuerdo. En recepción ya tienen tu nombre.',now()-interval '3 hours 45 minutes'),
  ('70000000-0000-4000-8000-000000000006','60000000-0000-4000-8000-000000000004','10000000-0000-4000-8000-000000000003','Las dos fundas están listas. Te comparto el código al llegar.',now()-interval '32 minutes'),
  ('70000000-0000-4000-8000-000000000007','60000000-0000-4000-8000-000000000004','c46db2af-a02b-4cc8-9ec4-bae578a84e3c','Estoy a una cuadra; entraré por la puerta principal.',now()-interval '9 minutes')
on conflict (id) do update set body=excluded.body,created_at=excluded.created_at;

insert into public.transactions (id,job_id,payer_id,courier_id,bid_id,service_fee_minor,platform_fee_minor,optional_tip_minor,status,idempotency_key,confirmed_at,created_at) values
  ('80000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000003','c46db2af-a02b-4cc8-9ec4-bae578a84e3c','10000000-0000-4000-8000-000000000002','50000000-0000-4000-8000-000000000003',18000,1800,0,'pending','81000000-0000-4000-8000-000000000001',null,now()-interval '18 hours'),
  ('80000000-0000-4000-8000-000000000002','40000000-0000-4000-8000-000000000004','10000000-0000-4000-8000-000000000003','c46db2af-a02b-4cc8-9ec4-bae578a84e3c','50000000-0000-4000-8000-000000000004',34000,3400,5000,'confirmed','81000000-0000-4000-8000-000000000002',now()-interval '5 hours',now()-interval '6 hours'),
  ('80000000-0000-4000-8000-000000000003','40000000-0000-4000-8000-000000000005','c46db2af-a02b-4cc8-9ec4-bae578a84e3c','10000000-0000-4000-8000-000000000005','50000000-0000-4000-8000-000000000005',22000,2200,3000,'confirmed','81000000-0000-4000-8000-000000000003',now()-interval '16 days',now()-interval '17 days'),
  ('80000000-0000-4000-8000-000000000004','40000000-0000-4000-8000-000000000006','10000000-0000-4000-8000-000000000004','c46db2af-a02b-4cc8-9ec4-bae578a84e3c','50000000-0000-4000-8000-000000000006',19500,1950,0,'confirmed','81000000-0000-4000-8000-000000000004',now()-interval '10 days',now()-interval '11 days')
on conflict (id) do update set status=excluded.status,confirmed_at=excluded.confirmed_at,optional_tip_minor=excluded.optional_tip_minor;

insert into public.reviews (id,service_kind,meeting_id,job_id,author_id,subject_id,rating,comment,created_at) values
  ('90000000-0000-4000-8000-000000000001','meeting','30000000-0000-4000-8000-000000000001',null,'10000000-0000-4000-8000-000000000001','c46db2af-a02b-4cc8-9ec4-bae578a84e3c',5,'Comunicación clara y entrega muy cuidadosa.',now()-interval '21 days'),
  ('90000000-0000-4000-8000-000000000002','meeting','30000000-0000-4000-8000-000000000001',null,'c46db2af-a02b-4cc8-9ec4-bae578a84e3c','10000000-0000-4000-8000-000000000001',5,'Llegó puntual y verificó el equipo antes de retirarse.',now()-interval '21 days'),
  ('90000000-0000-4000-8000-000000000003','job',null,'40000000-0000-4000-8000-000000000005','10000000-0000-4000-8000-000000000005','c46db2af-a02b-4cc8-9ec4-bae578a84e3c',5,'Indicaciones precisas y entrega confirmada sin demoras.',now()-interval '16 days'),
  ('90000000-0000-4000-8000-000000000004','job',null,'40000000-0000-4000-8000-000000000006','10000000-0000-4000-8000-000000000004','c46db2af-a02b-4cc8-9ec4-bae578a84e3c',4,'Servicio responsable; las carpetas llegaron en perfecto estado.',now()-interval '10 days')
on conflict (id) do update set rating=excluded.rating,comment=excluded.comment;

insert into public.notifications (id,user_id,kind,title,body,service_kind,service_id,read_at,created_at) values
  ('a0000000-0000-4000-8000-000000000005','10000000-0000-4000-8000-000000000001','job_published','Encargo publicado','Tu solicitud para trasladar el sintetizador ya está visible para repartidores cercanos.','job','40000000-0000-4000-8000-000000000001',null,now()-interval '34 minutes'),
  ('a0000000-0000-4000-8000-000000000006','10000000-0000-4000-8000-000000000001','meeting_completed','Encuentro completado','La entrega de la cámara analógica quedó registrada correctamente.','meeting','30000000-0000-4000-8000-000000000001',now()-interval '20 days',now()-interval '21 days'),
  ('a0000000-0000-4000-8000-000000000001','c46db2af-a02b-4cc8-9ec4-bae578a84e3c','meeting_arrival','Renata ya llegó','Tu contacto confirmó su llegada al Japanese Friendship Garden.','meeting','30000000-0000-4000-8000-000000000002',null,now()-interval '20 minutes'),
  ('a0000000-0000-4000-8000-000000000002','c46db2af-a02b-4cc8-9ec4-bae578a84e3c','new_bid','Nueva propuesta recibida','Gael propuso $285 MXN para trasladar tu maqueta.','job','40000000-0000-4000-8000-000000000002',null,now()-interval '90 minutes'),
  ('a0000000-0000-4000-8000-000000000003','c46db2af-a02b-4cc8-9ec4-bae578a84e3c','job_assigned','Encargo confirmado','Gael aceptó recoger tu edición de fotografía urbana.','job','40000000-0000-4000-8000-000000000003',now()-interval '3 hours',now()-interval '18 hours'),
  ('a0000000-0000-4000-8000-000000000004','c46db2af-a02b-4cc8-9ec4-bae578a84e3c','review_received','Recibiste una reseña','Amalia calificó el servicio con cinco estrellas.', 'job','40000000-0000-4000-8000-000000000005',now()-interval '15 days',now()-interval '16 days')
on conflict (id) do update set title=excluded.title,body=excluded.body,read_at=excluded.read_at,created_at=excluded.created_at;
