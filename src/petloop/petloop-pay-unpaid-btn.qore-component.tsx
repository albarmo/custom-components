import { registerComponent } from "@qorebase/app-cli";
import React from 'react'

import {
  Box,
  Button,
} from '@chakra-ui/react'

const payUnpaidBtn = registerComponent("Petloop Pay Unpaid Button", {
  type: "none",
  icon: "IconX",
  group: "button",
  defaultProps: {
    label: "",
    link: "",
  },
  propDefinition: {
    label: {
      type: "string",
      options: {
        format: "text",
      },
    },
    link: {
      type: "string",
      options: {
        format: "text",
      },
    },
  },
  Component: (props) => {
    const label = props.hooks.useTemplate(props.properties.label)
    const link = props.hooks.useTemplate(props.properties.link)

    const [loading, setLoading] = React.useState(false)

    const handlePay = async () => {
      window.location.replace(link);
    }

    return (
      <Box padding="4px" pt="0" mt="0" h="min-content">
        <Box
          p={1}
          pt={4}
          pb={4}
        >
          <Button
            width="full"
            colorScheme="blue"
            onClick={handlePay}
            isLoading={loading}
            loadingText="Loading..."
          >{label}</Button>
        </Box>
      </Box>
    )
  }
})

export default payUnpaidBtn