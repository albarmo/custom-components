import { registerComponent } from "@qorebase/app-cli";
import React from 'react'
import {
  Badge,
  Box,
  Divider,
  Flex,
  Image,
  SimpleGrid,
  Text,
  Grid,
  GridItem,
  Skeleton,
  Stack,
  Center,
  Input,
  Button
} from '@chakra-ui/react'

const url = 'https://staging-qore-data-teacher-593643.qore.dev'
const headers = {
  accept: '*/*',
  'x-qore-engine-admin-secret': 'UM5MlKofJjxhC0KQejD8WZi2cmbpAN5A',
}

function Item(props) {
  const { item } = props

  const itemId = props.hooks.useTemplate(item.id || props.source.itemId)

  const imageSource = props.hooks.useTemplate(props.properties.imageSource)
  const name = props.hooks.useTemplate(props.properties.name)
  const sku = props.hooks.useTemplate(props.properties.sku)
  const categoryName = props.hooks.useTemplate(props.properties.categoryName)
  const stockNow = props.hooks.useTemplate(props.properties.stockNow)

  const [loading, setLoading] = React.useState(false)

  const [qtyReal, setQtyReal] = React.useState(stockNow)

  const client = props.hooks.useClient()

  const handleUpdateStockReal = async () => {
    setLoading(true)
    try {
      //update stock real
      await client.project.axios({
        method: 'post',
        headers,
        url: `${url}/v1/execute`,
        data: {
          operations: [
            {
              operation: 'Update',
              instruction: {
                table: 'Products',
                name: "updateProduct",
                condition: {
                  id: itemId
                },
                set: {
                  temp_stock_real: qtyReal ?? 0
                },
              }
            },
          ]
        }
      })
    } catch (error) {
      setQtyReal(stockNow)
      console.log(error.message)
    }
    setLoading(false)
  }

  return (
    <Box
      borderWidth='1px'
      p={2}
      borderColor={'#FAFAFA'}
      key={itemId}
      bg={'white'}
    >
      <Box>
        <Flex alignItems={'center'}>
          <Box pr={2}>
            <Image
              boxSize='40px'
              objectFit='cover'
              src={imageSource}
              alt={name}
            />
          </Box>

          <Box flex={1} flexDirection="row" noOfLines={4}>
            <Text fontSize="sm" fontWeight={'semibold'} noOfLines={1} >
              {name}
            </Text>

            <Flex justifyContent={'space-between'}>
              <Text
                fontSize="sm"
                noOfLines={1}
              >
                {sku}
              </Text>
              <Text
                fontSize="sm"
                noOfLines={1}
              >
                <Badge colorScheme='gray' textTransform={'none'}>{categoryName}</Badge>
              </Text>
            </Flex>
          </Box>
        </Flex>
      </Box>
      <Divider mt={1} mb={1} color="gray.300" opacity={1} />
      <Box>
        <Flex justifyContent={'space-between'}>
          <Box>
            <Text fontSize="xs" noOfLines={1} textAlign={'center'} color={'blue.400'}>
              Stok Sisa
            </Text>
            <Text fontSize="sm" fontWeight={'semibold'} noOfLines={1} textAlign={'center'} color={'blue.400'}>
              {stockNow}
            </Text>
          </Box>
          <Box>
            <Text fontSize="xs" noOfLines={1} textAlign={'center'}>
              Stok Real
            </Text>
            <Input
              size={'sm'}
              value={qtyReal}
              textAlign={'center'}
              width={'80px'}
              borderColor={'#f1f1f1'}
              type={'number'}
              disabled={loading}
              onBlur={handleUpdateStockReal}
              onChange={(e) => {
                let value = e.target.value
                if (value.length > 0) {
                  setQtyReal(parseInt(value).toString())
                } else {
                  setQtyReal('0')
                }
              }}
            />
          </Box>
        </Flex>
      </Box>
    </Box>
  )
}

const LoaderItem: React.FC = () => (
  <Grid templateColumns="repeat(12, 1fr)" gap={4}>
    <GridItem colSpan={9}>
      <Skeleton height="16px" width="100%" borderRadius="lg" mb={1} />
      <Stack spacing="4px">
        <Skeleton height="16px" width="50%" borderRadius="lg" />
        <Skeleton height="16px" borderRadius="lg" />
        <Skeleton height="16px" borderRadius="lg" />
        <Skeleton height="16px" borderRadius="lg" />
      </Stack>
    </GridItem>
    <GridItem colSpan={3}>
      <Center w="100%" h="100%">
        <Skeleton boxSize="64px" borderRadius="lg" />
      </Center>
    </GridItem>
  </Grid>
);

export default registerComponent("Petloop Stock Opname List & Save", {
  type: "list",
  icon: "IconX",
  group: "list",
  defaultProps: {
    header: "List Produk",
    imageSource: "https://via.placeholder.com/150",
    name: "Nama Barang",
    sku: "SKU0001",
    categoryName: "Kategori",
    stockNow: "0",
    servicePlaceId: "",
    dateStart: "",
    dateEnd: "",
    note: "",
    userId: "",
    action: { type: 'none' },
  },
  propDefinition: {
    header: {
      type: "string",
      options: {
        format: "text",
      },
    },
    imageSource: { group: "Thumbnail", type: "string", options: { format: "text" } },
    name: { group: "Design", type: "string", options: { format: "text" } },
    sku: { group: "Design", type: "string", options: { format: "text" } },
    categoryName: { group: "Design", type: "string", options: { format: "text" } },
    stockNow: { group: "Design", type: "string", options: { format: "text" } },
    servicePlaceId: { group: "Design", type: "string", options: { format: "text" } },
    dateStart: { group: "Design", type: "string", options: { format: "text" } },
    dateEnd: { group: "Design", type: "string", options: { format: "text" } },
    note: { group: "Design", type: "string", options: { format: "text" } },
    userId: { group: "Design", type: "string", options: { format: "text" } },
    action: {
      group: 'Action',
      type: 'action',
      label: "Action Save",
      options: { type: 'none' }
    },
  },
  Component: (props) => {
    const { rows, loading, error, revalidate } = props.data.component

    const client = props.hooks.useClient()

    const header = props.hooks.useTemplate(props.properties.header)
    const servicePlaceId = props.hooks.useTemplate(props.properties.servicePlaceId)
    const dateStart = props.hooks.useTemplate(props.properties.dateStart)
    const dateEnd = props.hooks.useTemplate(props.properties.dateEnd)
    const note = props.hooks.useTemplate(props.properties.note)
    const userId = props.hooks.useTemplate(props.properties.userId)

    const [isLoading, setIsLoading] = React.useState(false)

    const action = props.hooks.useActionTrigger(
      props.properties.action,
      props.data.page.row,
      props.pageSource,
    )

    const handleResetStockReal = async () => {
      setIsLoading(true)
      try {
        //get all product by service place id
        const responseProduct = await client.project.axios({
          method: 'post',
          headers,
          url: `${url}/v1/execute`,
          data: {
            operations: [
              {
                operation: 'Select',
                instruction: {
                  table: 'Products',
                  name: "dataProduct",
                  condition: {
                    service_place_products: servicePlaceId
                  },
                },
              },
            ]
          }
        })

        const products = responseProduct.data.results.dataProduct

        if (products.length > 0) {
          //update stock real = stock now
          await client.project.axios({
            method: 'post',
            headers,
            url: `${url}/v1/execute`,
            data: {
              operations: [
                ...products.map((item) => ({
                  operation: 'Update',
                  instruction: {
                    table: 'Products',
                    name: "updateProduct",
                    condition: {
                      id: item.id
                    },
                    set: {
                      temp_stock_real: item.quantity,
                    },
                  }
                }))
              ]
            }
          })
        }

        revalidate()
      } catch (error) {
        console.log(error.message)
      }
      setIsLoading(false)
    }

    const handleSave = async () => {
      setIsLoading(true)

      let date = new Date();
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
      let month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
      let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);

      try {
        //get all product by service place id
        const responseProduct = await client.project.axios({
          method: 'post',
          headers,
          url: `${url}/v1/execute`,
          data: {
            operations: [
              {
                operation: 'Select',
                instruction: {
                  table: 'Products',
                  name: "dataProduct",
                  condition: {
                    service_place_products: servicePlaceId
                  },
                },
              },
            ]
          }
        })

        const products = responseProduct.data.results.dataProduct

        if (products.length > 0) {
          //save stock opname

          const stockOpnameCode = `${day}${month}${year}/${Math.random().toString().slice(2, 6)}`

          await client.project.axios({
            method: 'post',
            headers,
            url: `${url}/v1/execute`,
            data: {
              operations: [
                {
                  operation: 'Insert',
                  instruction: {
                    table: 'stock_opname',
                    name: "insertSO",
                    data: {
                      date_start: dateStart ? new Date(dateStart).toISOString() : new Date().toISOString(),
                      date_end: dateEnd ? new Date(dateEnd).toISOString() : new Date().toISOString(),
                      code: stockOpnameCode,
                      note,
                      service_place_stock_opname: servicePlaceId,
                      user_stock_opname: userId,
                    },
                  },
                },
                ...products.map((item) => {
                  let note = "Sama"

                  if (item.quantity > item.temp_stock_real) {
                    note = `Kurang ${(item.quantity - item.temp_stock_real)}`
                  }
                  if (item.quantity < item.temp_stock_real) {
                    note = `Lebih ${(item.temp_stock_real - item.quantity)}`
                  }

                  return {
                    operation: 'Insert',
                    instruction: {
                      table: 'stock_opname_items',
                      name: "insertSOItems",
                      data: {
                        stock_opname: "{{insertSO[0].id}}",
                        product_stock_opname: item.id,
                        qty: item.temp_stock_real,
                        qty_before: item.quantity,
                        note
                      },
                    },
                  }
                }),
                ...products
                  .filter(item => item.temp_stock_real != item.quantity)
                  .map((item) => {
                    let qtyIn = 0
                    let qtyOut = 0

                    if (item.quantity > item.temp_stock_real) {
                      qtyOut = item.quantity - item.temp_stock_real
                    } else {
                      qtyIn = item.temp_stock_real - item.quantity
                    }

                    return {
                      operation: 'Update',
                      instruction: {
                        table: 'Products',
                        name: "updateProducts",
                        condition: {
                          id: item.id
                        },
                        set: {
                          quantity: item.temp_stock_real,
                          total_stock_in: item.total_stock_in + qtyIn,
                          total_stock_out: item.total_stock_out + qtyOut,
                        },
                      },
                    }
                  }),
                ...products
                  .filter(item => item.temp_stock_real != item.quantity)
                  .map((item) => {
                    let qty = 0
                    let type = "Masuk"

                    if (item.quantity > item.temp_stock_real) {
                      qty = item.quantity - item.temp_stock_real
                      type = `Keluar`
                    } else {
                      qty = item.temp_stock_real - item.quantity
                      type = `Masuk`
                    }

                    return {
                      operation: 'Insert',
                      instruction: {
                        table: 'stock_log',
                        name: "insertStockLog",
                        data: {
                          stock_log_product: item.id,
                          qty,
                          qty_before: item.quantity,
                          qty_after: item.temp_stock_real,
                          type,
                          note: `Stok Opname No. ${stockOpnameCode}`,
                        },
                      },
                    }
                  }),
              ]
            }
          })

          action.handleClick()
        }
      } catch (error) {
        console.log(error.message)
      }
      setIsLoading(false)
    }

    React.useEffect(() => {
      handleResetStockReal()
    }, [])

    if (loading || isLoading) {
      return (
        <Stack spacing="7" p={4}>
          {Array(2)
            .fill(null)
            .map(() => (
              <LoaderItem />
            ))}
        </Stack>
      );
    }

    return (
      <Box p={2} h="min-content">
        <Box
          p={2}
          pt={4}
          pb={4}
        >
          <Text fontWeight="bold" fontSize="md" mb={2}>
            {header ? header : null}
          </Text>

          <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={2}>
            {rows.map((item) => (
              <props.components.ListItemVariables key={item.id} variables={item}>
                <Item key={item.id} item={item} {...props} />
              </props.components.ListItemVariables>
            ))}
          </SimpleGrid>

          <Button
            mt={2}
            width="full"
            colorScheme="blue"
            onClick={handleSave}
            isLoading={loading}
            loadingText="Loading..."
          >Simpan</Button>
        </Box>
      </Box>
    )
  }
})