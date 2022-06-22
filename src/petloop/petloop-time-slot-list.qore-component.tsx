import { registerComponent } from "@qorebase/app-cli";
import React from 'react'
import dayjs from 'dayjs'
import {
  IconCheckCircle,
  IconXCircle,
} from '@feedloop/icon'
import {
  Box,
  Grid,
  GridItem,
  Skeleton,
  Stack,
  Center,
  Alert,
  AlertIcon,
  Button,
  Icon,
  Text
} from '@chakra-ui/react'

function Item(props) {
  const { item } = props

  const itemId = props.hooks.useTemplate(item.id || props.source.itemId)

  return (
    <GridItem key={itemId} w="100%" h="10item">
      <Button
        disabled={
          item.status === 'Booked' ||
          (item.time < dayjs().format('HH:MM A') &&
            item.date == dayjs().format('YYYY-MM-DD'))
        }
        as={Button}
        bg={'#fff'}
        w={'100%'}
        p="4"
        borderRadius={'md'}
        onClick={() => { }}
        textAlign="left"
        color="black"
      >
        <Icon
          mr="2"
          as={item.status === 'Booked' ? IconXCircle : IconCheckCircle}
          color={item.status === 'Booked' ? 'gray' : 'blue.500'}
        />
        {item.time}
      </Button>
    </GridItem>
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

export default registerComponent("Petloop Time Slot List", {
  type: "list",
  icon: "IconX",
  group: "list",
  defaultProps: {
    header: "",
  },
  propDefinition: {
    header: {
      type: "string",
      options: {
        format: "text",
      },
    },
  },
  Component: (props) => {
    const { rows, loading, error, revalidate } = props.data.component
    const client = props.hooks.useClient()
    const header = props.hooks.useTemplate(props.properties.header)

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
      <Box padding="4px" pt="0" mt="0" h="min-content">
        <Text fontWeight="bold" fontSize="md" mb={2}>
          {header ? header : null}
        </Text>
        {rows.length <= 0
          ?
          <Alert status="warning" p="5">
            <AlertIcon />
            Slot jadwal pertemuan belum tersedia pada hari ini
          </Alert>
          :
          <Grid templateColumns="repeat(2, 1fr)" gap={6} p="4">
            {rows.map((item) => (
              <props.components.ListItemVariables key={item.id} variables={item}>
                <Item key={item.id} item={item} {...props} />
              </props.components.ListItemVariables>
            ))}
          </Grid>
        }
      </Box>
    )
  }
})