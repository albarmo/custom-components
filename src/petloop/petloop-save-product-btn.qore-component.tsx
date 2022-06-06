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

const payBtn = registerComponent("Petloop Save Product Button", {
  type: "none",
  icon: "IconX",
  group: "button",
  defaultProps: {
    label: "",
    rowId: "",
    category: "",
    city: "",
    description: "",
    image: "",
    name: "",
    price: "",
    servicePlace: "",
    sku: "",
    stock: "",
    action: { type: 'none' },
  },
  propDefinition: {
    label: {
      type: "string",
      options: {
        format: "text",
      },
    },
    rowId: {
      type: "string",
      options: {
        format: "text",
      },
    },
    category: {
      type: "string",
      options: {
        format: "text",
      },
    },
    city: {
      type: "string",
      options: {
        format: "text",
      },
    },
    description: {
      type: "string",
      options: {
        format: "text",
      },
    },
    image: {
      type: "string",
      options: {
        format: "text",
      },
    },
    name: {
      type: "string",
      options: {
        format: "text",
      },
    },
    price: {
      type: "string",
      options: {
        format: "text",
      },
    },
    servicePlace: {
      type: "string",
      options: {
        format: "text",
      },
    },
    sku: {
      type: "string",
      options: {
        format: "text",
      },
    },
    stock: {
      type: "string",
      options: {
        format: "text",
      },
    },
    action: {
      group: 'Action',
      type: 'action',
      label: "Success Action",
      options: { type: 'none' }
    },
  },
  Component: (props) => {
    const client = props.hooks.useClient()
    const label = props.hooks.useTemplate(props.properties.label)
    const rowId = props.hooks.useTemplate(props.properties.rowId)

    const category = props.hooks.useTemplate(props.properties.category)
    const city = props.hooks.useTemplate(props.properties.city)
    const description = props.hooks.useTemplate(props.properties.description)
    const image = props.hooks.useTemplate(props.properties.image)
    const name = props.hooks.useTemplate(props.properties.name)
    const price = props.hooks.useTemplate(props.properties.price)
    const servicePlace = props.hooks.useTemplate(props.properties.servicePlace)
    const sku = props.hooks.useTemplate(props.properties.sku)
    const stock = props.hooks.useTemplate(props.properties.stock)

    const [loading, setLoading] = React.useState(false)

    const action = props.hooks.useActionTrigger(
      props.properties.action,
      props.data.page.row,
      props.pageSource,
    )

    const handleSave = async () => {
      if (name.length <= 0) return

      setLoading(true)

      try {
        if (!rowId) {
          await client.project.axios({
            method: 'post',
            headers,
            url: `${url}/v1/execute`,
            data: {
              operations: [
                {
                  operation: 'Insert',
                  instruction: {
                    table: 'Products',
                    name: "insertProduct",
                    data: {
                      name,
                      description,
                      quantity: stock,
                      price,
                      image,
                      product_category: category,
                      service_place_products: servicePlace,
                      product_city: city,
                      sku,
                    },
                  },
                },
              ]
            }
          })
        } else {
          await client.project.axios({
            method: 'post',
            headers,
            url: `${url}/v1/action/Products/action_update/${rowId}`,
            data: {
              args: {
                category,
                city,
                description,
                id: rowId,
                image,
                name,
                price,
                servicePlace,
                sku,
                stock,
              }
            }
          })
        }

        action.handleClick()
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
            onClick={handleSave}
            isLoading={loading}
            loadingText="Loading..."
          >{label}</Button>
        </Box>
      </Box>
    )
  }
})

export default payBtn