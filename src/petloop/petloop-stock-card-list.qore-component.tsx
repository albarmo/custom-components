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
  Center
} from '@chakra-ui/react'

function Item(props) {
  const { item } = props

  const itemId = props.hooks.useTemplate(item.id || props.source.itemId)

  const imageSource = props.hooks.useTemplate(props.properties.imageSource)
  const name = props.hooks.useTemplate(props.properties.name)
  const sku = props.hooks.useTemplate(props.properties.sku)
  const categoryName = props.hooks.useTemplate(props.properties.categoryName)
  const stockIn = props.hooks.useTemplate(props.properties.stockIn)
  const stockOut = props.hooks.useTemplate(props.properties.stockOut)
  const stockNow = props.hooks.useTemplate(props.properties.stockNow)

  const actionDetail = props.hooks.useActionTrigger(
    props.properties.actionDetail,
    props.data.page.row,
    props.pageSource,
  )

  return (
    <Box
      borderWidth='1px'
      p={2}
      borderColor={'#FAFAFA'}
      key={itemId}
      bg={'white'}
      cursor={'pointer'}
      onClick={actionDetail.handleClick}
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
            <Text fontSize="xs" noOfLines={1} textAlign={'center'} color={'green.400'}>
              Stok Masuk
            </Text>
            <Text fontSize="sm" fontWeight={'semibold'} noOfLines={1} textAlign={'center'} color={'green.400'}>
              {stockIn}
            </Text>
          </Box>
          <Box>
            <Text fontSize="xs" noOfLines={1} textAlign={'center'} color={'red.400'}>
              Stok Keluar
            </Text>
            <Text fontSize="sm" fontWeight={'semibold'} noOfLines={1} textAlign={'center'} color={'red.400'}>
              {stockOut}
            </Text>
          </Box>
          <Box>
            <Text fontSize="xs" noOfLines={1} textAlign={'center'} color={'blue.400'}>
              Stok Sisa
            </Text>
            <Text fontSize="sm" fontWeight={'semibold'} noOfLines={1} textAlign={'center'} color={'blue.400'}>
              {stockNow}
            </Text>
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

export default registerComponent("Petloop Stock Card List", {
  type: "list",
  icon: "IconX",
  group: "list",
  defaultProps: {
    header: "Kartu Stok",
    imageSource: "https://via.placeholder.com/150",
    name: "Nama Barang",
    sku: "SKU0001",
    categoryName: "Kategori",
    stockIn: "0",
    stockOut: "0",
    stockNow: "0",
    actionDetail: { type: 'none' },
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
    stockIn: { group: "Design", type: "string", options: { format: "text" } },
    stockOut: { group: "Design", type: "string", options: { format: "text" } },
    stockNow: { group: "Design", type: "string", options: { format: "text" } },
    actionDetail: {
      group: 'Action',
      type: 'action',
      label: "Item Action Detail",
      options: { type: 'none' }
    },
  },
  Component: (props) => {
    const { rows, loading, error, revalidate } = props.data.component

    if (loading) {
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
          <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={2}>
            {rows.map((item) => (
              <props.components.ListItemVariables key={item.id} variables={item}>
                <Item key={item.id} item={item} {...props} />
              </props.components.ListItemVariables>
            ))}
          </SimpleGrid>
        </Box>
      </Box>
    )
  }
})