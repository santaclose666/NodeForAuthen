import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

const Test = () => {
  const { control, handleSubmit, setValue, register } = useForm({
    defaultValues: {
      items: [{ name: 'Item 1', quantity: '1' }, { name: 'Item 2', quantity: '2' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const handleMultiFieldChange = (index, field, value) => {
    // Update multiple fields at once
    setValue(`items[${index}].${field}`, value);
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <View>
      {fields.map((item, index) => (
        <View key={item.id}>
          <Controller
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                placeholder={`Item ${index + 1}`}
                style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
                onChangeText={(value) =>
                  handleMultiFieldChange(index, 'name', value)
                }
              />
            )}
            name={`items[${index}].name`}
            rules={{ required: 'This field is required' }}
          />
          <Controller
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                placeholder={`Quantity`}
                style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
                onChangeText={(value) =>
                  handleMultiFieldChange(index, 'quantity', value)
                }
              />
            )}
            name={`items[${index}].quantity`}
            rules={{ required: 'This field is required' }}
          />
          <Button onPress={() => remove(index)} title="Remove" />
        </View>
      ))}
      <Button onPress={() => append({ name: '', quantity: '' })} title="Add Item" />

      <Button onPress={handleSubmit(onSubmit)} title="Submit" />
    </View>
  );
};

export default Test;
