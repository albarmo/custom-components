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
  const code = props.hooks.useTemplate(props.properties.code)
  const date = props.hooks.useTemplate(props.properties.date)
  const status = props.hooks.useTemplate(props.properties.status)
  const storeName = props.hooks.useTemplate(props.properties.storeName)
  const totalItems = props.hooks.useTemplate(props.properties.totalItems)
  const grandTotal = props.hooks.useTemplate(props.properties.grandTotal)

  const actionDetailUnpaid = props.hooks.useActionTrigger(
    props.properties.actionDetailUnpaid,
    props.data.page.row,
    props.pageSource,
  )

  const actionDetailPaid = props.hooks.useActionTrigger(
    props.properties.actionDetailPaid,
    props.data.page.row,
    props.pageSource,
  )

  const actionDetailExpired = props.hooks.useActionTrigger(
    props.properties.actionDetailExpired,
    props.data.page.row,
    props.pageSource,
  )

  const handleClick = () => {
    if (status == 'PENDING') {
      actionDetailUnpaid.handleClick()
    } else if (status === 'PAID') {
      actionDetailPaid.handleClick()
    } else if (status === 'EXPIRED') {
      actionDetailExpired.handleClick()
    } else {
      actionDetailPaid.handleClick()
    }
  }

  return (
    <Box
      borderWidth='1px'
      p={2}
      borderColor={'#FAFAFA'}
      key={itemId} bg={'white'}
      cursor={'pointer'}
      onClick={handleClick}
    >
      <Flex flexDirection={'row'} justifyContent={'space-between'}>
        <Box>
          <Text fontSize="sm" fontWeight={'semibold'} noOfLines={1}>
            {code}
          </Text>
          <Text fontSize="xs" noOfLines={1}>
            {date}
          </Text>
        </Box>

        <Box>
          {status == 'PAID' &&
            <Badge colorScheme='green' textTransform={'none'}>Terbayar</Badge>
          }

          {status == 'PENDING' &&
            <Badge colorScheme='gray' textTransform={'none'}>Belum bayar</Badge>
          }

          {status == 'EXPIRED' &&
            <Badge colorScheme='red' textTransform={'none'}>Expired</Badge>
          }

          {status != 'PAID' || status != 'PENDING' || status != 'EXPIRED' &&
            <Badge colorScheme='purple' textTransform={'none'}>{status}</Badge>
          }

        </Box>
      </Flex>

      <Divider mt={2} mb={2} color="gray.300" />

      <Box flex={1} flexDirection="column">
        <Flex alignItems={'center'}>
          <Box pr={2}>
            <Image
              boxSize='60px'
              objectFit='cover'
              src={imageSource}
              alt={storeName}
            />
          </Box>

          <Box flex={1} flexDirection="row" noOfLines={4}>
            <Text fontSize="sm" fontWeight={'semibold'} noOfLines={1} >
              {storeName}
            </Text>

            <Flex justifyContent={'space-between'}>
              <Text
                fontSize="sm"
                noOfLines={1}
              >
                {totalItems} Item
              </Text>

              <Text
                fontSize="sm"
                noOfLines={1}
              >
                Total : <span style={{ fontWeight: 600 }}>{grandTotal}</span>
              </Text>
            </Flex>
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

export default registerComponent("Petloop Transaction List", {
  type: "list",
  icon: "IconX",
  group: "list",
  defaultProps: {
    header: "Riwayat Transaksi",
    imageSource: "https://via.placeholder.com/150",
    code: "#INV",
    date: "",
    status: "PENDING",
    storeName: "Store Name",
    totalItems: "0",
    grandTotal: "0",
    actionDetailUnpaid: { type: 'none' },
    actionDetailPaid: { type: 'none' },
    actionDetailExpired: { type: 'none' },
  },
  propDefinition: {
    header: {
      type: "string",
      options: {
        format: "text",
      },
    },
    imageSource: { group: "Thumbnail", type: "string", options: { format: "text" } },
    code: { group: "Design", type: "string", options: { format: "text" } },
    date: { group: "Design", type: "string", options: { format: "text" } },
    status: { group: "Design", type: "string", options: { format: "text" } },
    storeName: { group: "Design", type: "string", options: { format: "text" } },
    totalItems: { group: "Design", type: "string", options: { format: "text" } },
    grandTotal: { group: "Design", type: "string", options: { format: "text" } },
    actionDetailUnpaid: {
      group: 'Action',
      type: 'action',
      label: "Item Action Unpaid",
      options: { type: 'none' }
    },
    actionDetailPaid: {
      group: 'Action',
      type: 'action',
      label: "Item Action Paid",
      options: { type: 'none' }
    },
    actionDetailExpired: {
      group: 'Action',
      type: 'action',
      label: "Item Action Expired",
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
          <SimpleGrid columns={1} spacing={2}>
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