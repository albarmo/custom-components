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

const BackToCart = registerComponent("Petloop Back To Cart Button", {
  type: "none",
  icon: "IconX",
  group: "button",
  defaultProps: {
    label: "",
    cartId: "",
    userId: "",
    action: { type: 'none' },
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
    userId: {
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
    const cartId = props.hooks.useTemplate(props.properties.cartId)
    const userId = props.hooks.useTemplate(props.properties.userId)

    const [loading, setLoading] = React.useState(false)

    const action = props.hooks.useActionTrigger(
      props.properties.action,
      props.data.page.row,
      props.pageSource,
    )

    const handleBack = async () => {
      setLoading(true)
      try {
        if (cartId == 'none') {
          action.handleClick()
          return
        }

        //get cart checkout item by cart id
        const responseCartCheckout = await client.project.axios({
          method: 'post',
          headers,
          url: `${url}/v1/execute`,
          data: {
            operations: [
              {
                operation: 'Select',
                instruction: {
                  table: 'cart_items',
                  name: "data",
                  condition: {
                    cart: cartId
                  },
                },
              }
            ]
          }
        })

        const cartItemCheckout = responseCartCheckout.data.results.data

        if (!responseCartCheckout.data.results.data.length) {
          action.handleClick()
          return
        }

        let total_price_cart_checkout = 0

        cartItemCheckout.forEach((item, index) => {
          total_price_cart_checkout += item.qty * item.price
        });

        //get cart draft item by user id
        const responseCartDraft = await client.project.axios({
          method: 'post',
          headers,
          url: `${url}/v1/execute`,
          data: {
            operations: [
              {
                operation: 'Select',
                instruction: {
                  table: 'carts',
                  name: "data",
                  condition: {
                    status: {
                      $eq: "Draft"
                    },
                    user_cart: {
                      $eq: userId
                    }
                  },
                },
              }
            ]
          }
        })

        if (!responseCartDraft.data.results.data.length) {
          //insert cart draft and cart item
          await client.project.axios({
            method: 'post',
            headers,
            url: `${url}/v1/execute`,
            data: {
              operations: [
                {
                  operation: 'Insert',
                  instruction: {
                    table: 'carts',
                    name: "insertCart",
                    data: {
                      user_cart: userId,
                      status: 'Draft',
                      total_price: total_price_cart_checkout,
                      grand_total: total_price_cart_checkout,
                    },
                  },
                },
                ...cartItemCheckout.map(item => {
                  return {
                    operation: 'Update',
                    instruction: {
                      table: 'cart_items',
                      name: "updateCartItem",
                      condition: {
                        id: item.id,
                      },
                      set: {
                        cart: "{{insertCart[0].id}}",
                        is_selected: false
                      }
                    }
                  }
                }),
                ...cartItemCheckout.map(item => {
                  return {
                    operation: 'Update',
                    instruction: {
                      table: 'Products',
                      name: "updateProduct",
                      condition: {
                        id: item.product_cart
                      },
                      set: {
                        quantity: item.quantity + item.qty
                      },
                    }
                  }
                }),
                ...cartItemCheckout.map(item => {
                  return {
                    operation: 'Insert',
                    instruction: {
                      table: 'stock_log',
                      name: "insertStockLog",
                      data: {
                        stock_log_product: item.product_cart,
                        qty: item.qty,
                        qty_before: item.quantity,
                        type: 'Masuk',
                        note: 'Pengembalian Checkout user ID: ' + userId,
                      },
                    },
                  }
                }),
                {
                  operation: 'Delete',
                  instruction: {
                    table: 'carts',
                    name: "deleteCart",
                    condition: {
                      id: cartId,
                    },
                  },
                },
              ]
            }
          })
        } else {
          const cartDraft = responseCartDraft.data.results.data[0]

          //update cart draft and update cart item
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
                    name: "UpdateCart",
                    condition: {
                      id: cartDraft.id,
                    },
                    set: {
                      total_price: cartDraft.total_price + total_price_cart_checkout,
                      grand_total: cartDraft.total_price + total_price_cart_checkout,
                    }
                  },
                },
                ...cartItemCheckout.map(item => {
                  return {
                    operation: 'Update',
                    instruction: {
                      table: 'cart_items',
                      name: "updateCartItem",
                      condition: {
                        id: item.id,
                      },
                      set: {
                        cart: cartDraft.id,
                        is_selected: false
                      }
                    }
                  }
                }),
                // ...cartItemCheckout.map(item => {
                //   return {
                //     operation: 'Update',
                //     instruction: {
                //       table: 'Products',
                //       name: "updateProduct",
                //       condition: {
                //         id: item.product_cart
                //       },
                //       set: {
                //         quantity: item.quantity + item.qty
                //       },
                //     }
                //   }
                // }),
                // ...cartItemCheckout.map(item => {
                //   return {
                //     operation: 'Insert',
                //     instruction: {
                //       table: 'stock_log',
                //       name: "insertStockLog",
                //       data: {
                //         stock_log_product: item.product_cart,
                //         qty: item.qty,
                //         qty_before: item.quantity,
                //         type: 'Masuk',
                //         note: 'Pengembalian Checkout user ID: ' + userId,
                //       },
                //     },
                //   }
                // }),
                {
                  operation: 'Delete',
                  instruction: {
                    table: 'carts',
                    name: "deleteCart",
                    condition: {
                      id: cartId,
                    },
                  },
                },
              ]
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
            variant='outline'
            onClick={handleBack}
            isLoading={loading}
            loadingText="Loading..."
          >{label}</Button>
        </Box>
      </Box>
    )
  }
})

export default BackToCart