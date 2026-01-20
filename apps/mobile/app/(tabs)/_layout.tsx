import { NativeTabs, VectorIcon, Icon, Label } from 'expo-router/unstable-native-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon src={<VectorIcon family={Ionicons} name="home" />} />
        <Label>Home</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="expenses">
        <Icon src={<VectorIcon family={Ionicons} name="wallet" />} />
        <Label>Summary</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="investments">
        <Icon src={<VectorIcon family={Ionicons} name="trending-up" />} />
        <Label>Investments</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="statistics">
        <Icon src={<VectorIcon family={Ionicons} name="bar-chart" />} />
        <Label>Statistics</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
