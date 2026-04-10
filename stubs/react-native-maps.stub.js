// Web stub — react-native-maps не підтримує веб
import React from 'react';
import { View } from 'react-native';

export default function MapView({ children, style }) {
  return React.createElement(View, { style });
}
export function Marker() { return null; }
export function Callout({ children }) { return React.createElement(React.Fragment, null, children); }
