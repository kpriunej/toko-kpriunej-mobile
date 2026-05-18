import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

const style: React.ComponentProps<typeof FontAwesome5Icon>['style'] = { 
  position: 'absolute',
  right: 12,
  top: '50%', 
  transform: [
    { translateY: -8 }
  ]
};

export default style;