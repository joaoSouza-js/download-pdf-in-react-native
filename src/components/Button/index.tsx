import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native"

import { styles } from "./styles"

type Props = TouchableOpacityProps & {

  isLoading?: boolean
}

export function Button({children,  isLoading = false, ...rest }: Props) {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color="#FFF" size="small" />
      ) : (
        <Text style={styles.title}>{children}</Text>
      )}
    </TouchableOpacity>
  )
}
