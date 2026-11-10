import { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../../components/Screen';
import { AppHeader } from '../../../components/AppHeader';
import { AppText } from '../../../components/AppText';
import { AppField } from '../../../components/AppField';
import { AppButton } from '../../../components/AppButton';
import { Card } from '../../../components/Card';
import { ChoiceRow } from '../../../components/ChoiceRow';
import { jobService } from '../../../services/jobService';
import { locationService } from '../../../services/locationService';
import { accountErrorMessage } from '../../../validation/account';
import { validateAddress, validateDescription, validateOptionalNote, validateTitle } from '../../../validation/text';
import type { RootStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'JobCreate'>;
type Category = 'Compras' | 'Paquetería' | 'Documentos' | 'Otro';

const categories: readonly Category[] = ['Compras', 'Paquetería', 'Documentos', 'Otro'];

export function JobCreateScreen({ navigation }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Compras');
  const [productPaid, setProductPaid] = useState(true);
  const [pickup, setPickup] = useState('');
  const [delivery, setDelivery] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validation = validateTitle(title) ?? validateDescription(description) ?? validateAddress(pickup) ?? validateAddress(delivery) ?? validateOptionalNote(notes);
  const valid = validation === null;

  const submit = async () => {
    if (validation) { setError(validation); return; }
    setBusy(true); setError(null);
    try {
      const pickupLocation = await locationService.address(pickup);
      const deliveryLocation = await locationService.address(delivery);
      const created = await jobService.create({
        title: title.trim(), description: description.trim(), category,
        declaredValueMinor: null,
        productPaymentStatus: productPaid ? 'declared_paid' : 'not_managed',
        pickupLabel: pickup.trim(), deliveryLabel: delivery.trim(),
        pickupLatitude: pickupLocation.latitude, pickupLongitude: pickupLocation.longitude,
        deliveryLatitude: deliveryLocation.latitude, deliveryLongitude: deliveryLocation.longitude,
        pickupPrivateNote: notes.trim(), deliveryPrivateNote: notes.trim(),
      });
      navigation.replace('JobDetail', { jobId: created.id });
    } catch (reason) { setError(accountErrorMessage(reason)); }
    finally { setBusy(false); }
  };

  return <Screen header={<AppHeader title="Pedir una recogida" onBack={() => navigation.goBack()} />}>
    <AppText variant="heading">¿Qué necesitas mover?</AppText>
    <AppField label="Nombre breve" value={title} onChangeText={setTitle} placeholder="Ej. Recoger un paquete" maxLength={100} {...(title && validateTitle(title) ? { error: validateTitle(title)! } : {})} />
    <AppField label="Descripción" value={description} onChangeText={setDescription} placeholder="Tamaño, color o cómo reconocerlo" multiline maxLength={500} {...(description && validateDescription(description) ? { error: validateDescription(description)! } : {})} />

    <Card><AppText variant="label">Tipo de encargo</AppText>{categories.map((item) => <ChoiceRow key={item} label={item} selected={category === item} onPress={() => setCategory(item)} />)}</Card>

    <AppText variant="title">Ruta</AppText>
    <AppField label="¿Dónde se recoge?" value={pickup} onChangeText={setPickup} placeholder="Dirección o nombre del lugar" autoComplete="street-address" maxLength={160} {...(pickup && validateAddress(pickup) ? { error: validateAddress(pickup)! } : {})} />
    <AppField label="¿Dónde se entrega?" value={delivery} onChangeText={setDelivery} placeholder="Dirección o nombre del lugar" autoComplete="street-address" maxLength={160} {...(delivery && validateAddress(delivery) ? { error: validateAddress(delivery)! } : {})} />
    <AppField label="Indicaciones (opcional)" value={notes} onChangeText={setNotes} placeholder="Ej. Preguntar en recepción" multiline maxLength={300} {...(notes && validateOptionalNote(notes) ? { error: validateOptionalNote(notes)! } : {})} />

    <Card><AppText variant="label">¿El producto ya está pagado?</AppText><AppText variant="caption" tone="secondary">El repartidor no debe adelantar dinero.</AppText><ChoiceRow label="Sí, ya está pagado" selected={productPaid} onPress={() => setProductPaid(true)} /><ChoiceRow label="No aplica" selected={!productPaid} onPress={() => setProductPaid(false)} /></Card>

    {error ? <AppText variant="caption" tone="error">{error}</AppText> : null}
    <AppButton title={busy ? 'Buscando direcciones…' : 'Publicar encargo'} disabled={!valid || busy} onPress={() => void submit()} />
    <AppText variant="caption" tone="secondary">Las direcciones exactas solo se comparten con el repartidor elegido.</AppText>
  </Screen>;
}
