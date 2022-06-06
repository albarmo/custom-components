import { registerComponent } from "@qorebase/app-cli";
import React from 'react'

import {
  Box,
  Text,
  FormControl,
  FormLabel,
  Spacer,
  Switch,
  SimpleGrid
} from "@chakra-ui/react";

const url = 'https://staging-qore-data-teacher-593643.qore.dev'
const headers = {
  accept: '*/*',
  'x-qore-engine-admin-secret': 'UM5MlKofJjxhC0KQejD8WZi2cmbpAN5A',
}

const withCourierToggle = registerComponent("Petloop With Courier Toggle", {
  type: "none",
  icon: "IconX",
  group: "input",
  defaultProps: {
    label: "Gunakan Kurir Toko?",
    descriptionTrue: "Barang akan dikirimkan kurir toko ke alamat anda.",
    descriptionFalse: "Anda dapat mengambil barang secara langsung di toko.",
    fontWeight: "normal",
    servicePlaceId: "",
    userId: "",
    cartId: "",
    userName: "Customer",
    userPhone: "081234567890",
    userAddress: "Jl. Kebon Jeruk No. 1",
  },
  propDefinition: {
    label: { group: "Design", type: "string", options: { format: "text" } },
    descriptionTrue: {
      group: "Design",
      type: "string",
      options: { format: "text" },
    },
    descriptionFalse: {
      group: "Design",
      type: "string",
      options: { format: "text" },
    },
    fontWeight: {
      group: "Design",
      type: "string",
      options: {
        format: "select",
        options: [
          { label: "Extra Bold", value: "extrabold" },
          { label: "Bold", value: "bold" },
          { label: "Reguler", value: "normal" },
          { label: "Thin", value: "thin" },
        ],
      },
    },
    servicePlaceId: {
      type: "string",
      options: {
        format: "text",
      },
    },
    userId: {
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
    userName: {
      type: "string",
      options: {
        format: "text",
      },
    },
    userPhone: {
      type: "string",
      options: {
        format: "text",
      },
    },
    userAddress: {
      type: "string",
      options: {
        format: "text",
      },
    },
  },
  Component: (props) => {
    const client = props.hooks.useClient()

    const label = props.hooks.useTemplate(props.properties.label)
    const fontWeight = props.hooks.useTemplate(props.properties.fontWeight)
    const descriptionTrue = props.hooks.useTemplate(props.properties.descriptionTrue)
    const descriptionFalse = props.hooks.useTemplate(props.properties.descriptionFalse)

    const servicePlaceId = props.hooks.useTemplate(props.properties.servicePlaceId)
    const userId = props.hooks.useTemplate(props.properties.userId)
    const cartId = props.hooks.useTemplate(props.properties.cartId)

    const userName = props.hooks.useTemplate(props.properties.userName)
    const userPhone = props.hooks.useTemplate(props.properties.userPhone)
    const userAddress = props.hooks.useTemplate(props.properties.userAddress)

    const [checked, setChecked] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)

    const handleToggle = async (value: boolean) => {
      setLoading(true)
      try {
        if (value) {
          //get user city, address and get store city
          const response = await client.project.axios({
            method: 'post',
            headers,
            url: `${url}/v1/execute`,
            data: {
              operations: [
                {
                  operation: 'Select',
                  instruction: {
                    table: 'users',
                    name: "dataUser",
                    condition: {
                      id: userId
                    },
                  },
                },
                {
                  operation: 'Select',
                  instruction: {
                    table: 'Service_Place',
                    name: "dataServicePlace",
                    condition: {
                      id: servicePlaceId
                    },
                  },
                }
              ]
            }
          })

          const user = response.data.results.dataUser[0]
          const servicePlace = response.data.results.dataServicePlace[0]

          if (!user.address)
            throw new Error("Lengkapi alamat anda terlebih dahulu.")

          // if (user.user_city != servicePlace.service_places_city)
          //   throw new Error("Lokasi toko tidak sesuai dengan lokasi anda.")
        }

        //update cart flag
        await client.project.axios({
          method: 'post',
          headers,
          url: `${url}/v1/execute`,
          data: {
            operations: [
              {
                operation: 'Update',
                instruction: {
                  table: 'carts',
                  name: "updateCart",
                  condition: {
                    id: cartId
                  },
                  set: {
                    with_courier: value
                  },
                }
              },
            ]
          }
        })

        setChecked(value)
      } catch (error) {
        setError(error.message)
      }
      setLoading(false)
    }

    return (
      <Box padding={4}>
        {error !== null &&
          <Text fontSize="sm" color="red">
            {error}
          </Text>
        }
        <FormControl display="flex" alignItems="center" flex={1} pb={2}>
          <FormLabel
            fontSize="lg"
            htmlFor={'withCourierToggle'}
            m="0"
            fontWeight={fontWeight}
          >
            {label}
          </FormLabel>
          <Spacer />
          <Switch
            id={'withCourierToggle'}
            isChecked={checked}
            size="md"
            colorScheme={`var(--chakra-colors-qore-primary);`}
            onChange={(e) => handleToggle(e.currentTarget.checked)}
          />
        </FormControl>
        <Box>
          <Text>{checked ? descriptionTrue : descriptionFalse}</Text>
        </Box>
        {checked &&
          <SimpleGrid columns={2} spacing={2} mt={4}>
            <Text fontSize="md">
              Nama Penerima
            </Text>
            <Text fontSize="md">
              {userName}
            </Text>
            <Text fontSize="md">
              No. Telepon
            </Text>
            <Text fontSize="md">
              {userPhone}
            </Text>
            <Text fontSize="md">
              Alamat
            </Text>
            <Text fontSize="md">
              {userAddress}
            </Text>
          </SimpleGrid>
        }
      </Box>
    )
  }
})

export default withCourierToggle