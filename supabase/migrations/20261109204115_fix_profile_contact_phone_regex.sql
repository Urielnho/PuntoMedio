alter table private.profile_contacts
  drop constraint profile_contacts_phone_format;

alter table private.profile_contacts
  add constraint profile_contacts_phone_format
  check (phone_e164 is null or phone_e164 ~ '^[+][1-9][0-9]{7,14}$');
