-- Demo seed (run after 001_initial.sql). Safe to re-run with ON CONFLICT.

insert into public.sellers (id, slug, owner_id, name_hy, name_ru, bio_hy, bio_ru, district, image_url) values
  ('ani', 'ani', null, 'Անի', 'Ани', 'Բնական մեղր և մեղրամիս Գառնիից', 'Натуральный мёд из Гарни', 'Գառնի', 'https://picsum.photos/seed/shuk-seller-ani/400/400'),
  ('mariam', 'mariam', null, 'Մարիամ', 'Мариам', 'Տնային լավաշ և հացեր', 'Домашний лаваш', 'Երևան', 'https://picsum.photos/seed/shuk-seller-mariam/400/400'),
  ('armen', 'armen', null, 'Արմեն', 'Армен', 'Կերամիկա և գեղարվեստ', 'Керамика ручной работы', 'Գյումրի', 'https://picsum.photos/seed/shuk-seller-armen/400/400'),
  ('lilit', 'lilit', null, 'Լիլիթ', 'Лилит', 'Արծաթե և հմուտ արդյունակություն', 'Серебряные украшения', 'Երևան', 'https://picsum.photos/seed/shuk-seller-lilit/400/400'),
  ('nare', 'nare', null, 'Նարե', 'Наре', 'Ձեռքով կարում և գործվածք', 'Вязаные изделия', 'Դիլիջան', 'https://picsum.photos/seed/shuk-seller-nare/400/400'),
  ('sona', 'sona', null, 'Սոնա', 'Сона', 'Ազգային գործվածք', 'Национальный текстиль', 'Երևան', 'https://picsum.photos/seed/shuk-seller-sona/400/400'),
  ('hakob', 'hakob', null, 'Հակոբ', 'Акоб', 'Կավի և կերամիկայի արտադրանք', 'Изделия из глины', 'Աշտարակ', 'https://picsum.photos/seed/shuk-seller-hakob/400/400'),
  ('gayane', 'gayane', null, 'Գայանե', 'Гаяне', 'Չրեր և տնական կոնսերվներ', 'Сухофрукты', 'Արարատ', 'https://picsum.photos/seed/shuk-seller-gayane/400/400')
on conflict (id) do nothing;

insert into public.products (id, seller_id, category, price_amd, district, image_url, featured, name_hy, name_ru, description_hy, description_ru) values
  ('honey-garni', 'ani', 'food', 4500, 'Գառնի', 'https://picsum.photos/seed/shuk-honey/800/600', true, 'Բնական մեղր', 'Натуральный мёд', 'Լեռնային մեղր Գառնիից, 500 գ', 'Горный мёд из Гарни, 500 г'),
  ('lavash-traditional', 'mariam', 'food', 800, 'Երևան', 'https://picsum.photos/seed/shuk-lavash/800/600', true, 'Լավաշ տնային', 'Домашний лаваш', 'Թարմ լավաշ, 5 հատ', 'Свежий лаваш, 5 штук'),
  ('ceramic-bowl', 'armen', 'crafts', 12000, 'Գյումրի', 'https://picsum.photos/seed/shuk-ceramic/800/600', true, 'Կերամիկայի կուժ', 'Керамическая чаша', 'Ձեռքով պատրաստված', 'Ручная работа'),
  ('silver-bracelet', 'lilit', 'crafts', 28000, 'Երևան', 'https://picsum.photos/seed/shuk-bracelet/800/600', true, 'Արծաթե թևնոց', 'Серебряный браслет', 'Արտիսանական արծաթ', 'Артизанское серебро'),
  ('knit-sweater', 'nare', 'clothing', 35000, 'Դիլիջան', 'https://picsum.photos/seed/shuk-sweater/800/600', false, 'Ձեռքով կարած զգավեստ', 'Вязаный свитер', '100% բուրդ, M', '100% шерсть, M'),
  ('national-scarf', 'sona', 'clothing', 15000, 'Երևան', 'https://picsum.photos/seed/shuk-scarf/800/600', false, 'Ազգային շալ', 'Национальный шарф', 'Վուշի գույներ', 'Цвета войлока'),
  ('clay-pot', 'hakob', 'home', 8500, 'Աշտարակ', 'https://picsum.photos/seed/shuk-clay-pot/800/600', false, 'Կավի կուժ', 'Глиняный горшок', 'Բնական կավ', 'Натуральная глина'),
  ('dried-fruits', 'gayane', 'food', 3200, 'Արարատ', 'https://picsum.photos/seed/shuk-dried-fruits/800/600', false, 'Չրերի հավաքածու', 'Набор сухофруктов', '400 գ', '400 г')
on conflict (id) do nothing;
