import { registerComponent } from "@qorebase/app-cli";
import React from 'react'

import {
  Box,
  Button,
} from '@chakra-ui/react'

const url = 'https://staging-qore-data-teacher-593643.qore.dev'
const headers = {
  accept: '*/*',
  'x-qore-engine-admin-secret': 'UM5MlKofJjxhC0KQejD8WZi2cmbpAN5A',
}

const payBtn = registerComponent("Petloop Pay Button", {
  type: "none",
  icon: "IconX",
  group: "button",
  defaultProps: {
    label: "",
    cartId: "",
  },
  propDefinition: {
    label: {
      type: "string",
      options: {
        format: "text",
      },
    },
    cartId: {
      type: "string",
      options: {
        format: "text",
      },
    },
  },
  Component: (props) => {
    const client = props.hooks.useClient()
    const label = props.hooks.useTemplate(props.properties.label)
    const cartId = props.hooks.useTemplate(props.properties.cartId)

    const [loading, setLoading] = React.useState(false)

    const handlePay = async () => {
      if (cartId == 'none') {
        return
      }
      
      setLoading(true)
      try {
        const actionResult = await client.project.axios({
          method: 'post',
          headers,
          url: `${url}/v1/action/carts/action_xendit/${cartId}`,
        })

        window.location.replace(actionResult.data.result.invoice_url);
      } catch (error) {
        throw new Error(error)
      }
      setLoading(false)
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

export default payBtn