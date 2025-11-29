
import React from 'react';
import { StyleSheet, TextInput, View, Text, TextInputProps } from 'react-native';

type Props = TextInputProps & { label?: string; secure?: boolean };

export default function TextInputField({ label, secure, style, ...rest }: Props) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput style={[styles.input, style]} secureTextEntry={secure} {...rest} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%', marginBottom: 12 },
  label: { fontSize: 12, color: '#6b7280', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#d1d5db', padding: 12, borderRadius: 8, backgroundColor: '#fff' },
});
