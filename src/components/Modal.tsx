import { createContext, useContext } from "react";
import { Pressable, Text, View } from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

type ModalContextValue = {
  onClose?: () => void;
};

type ModalSectionProps = {
  children: string | React.ReactNode;
  className?: string;
};

const ModalContext = createContext<ModalContextValue | null>(null);
export const useModal = () => useContext(ModalContext);

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: string | React.ReactNode;
  size?: string;
  className?: string;
}
const Modal: React.FC<ModalProps> & {
  Header: React.FC<{ children: string | React.ReactNode }>;
  Body: React.FC<ModalSectionProps>;
  Footer: React.FC<ModalSectionProps>;
} = ({ show, onClose, children, size = "w-md" }) => {
  return (
    <ModalContext.Provider value={{ onClose }}>
      <View
        className={`
          w-screen h-screen fixed inset-0 z-45 flex items-center justify-center
          transition-opacity duration-200
          ${show ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      >
        <View
          className={`
            bg-white text-slate-900
            rounded-lg shadow-lg p-6 max-h-[92vh]
            transform transition-all duration-400 ease-out
            ${show ? "opacity-100 scale-100" : "opacity-0 scale-85 pointer-events-none"}
            ${size}
          `}
        >
          {children}
        </View>
      </View>
    </ModalContext.Provider>
  );
};


Modal.Header = ({ children }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { onClose } = useModal() || {};
  return (
    <View className="flex justify-between items-center border-b border-slate-200 pb-4">
      {typeof children === "string" && <Text className="text-lg font-semibold">{children}</Text>}
      <Text className="text-lg font-semibold">{children}</Text>
      <Pressable
        onPress={onClose}
        className="text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none cursor-pointer"
      >
        <FontAwesome5Icon name="times" />
      </Pressable>
    </View>
  );
};

Modal.Body = ({ children, className, ...props }) => (
  <View className={className ?? "p-4 max-h-[70vh] overflow-y-auto"} {...props}>
    {children}
  </View>
);

Modal.Footer = ({ children, className }) => (
  <View
    className={`border-t border-slate-300 pt-4 ${className ?? "flex justify-end items-center gap-2"}`}
  >
    {children}
  </View>
);


export default Modal;
