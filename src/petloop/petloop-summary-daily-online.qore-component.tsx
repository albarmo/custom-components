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

const formatRupiah = (numb) => {
  if (!numb) return 0
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(numb)
}

export default registerComponent("Petloop Summary Daily Online", {
  type: "none",
  icon: "IconX",
  group: "input",
  defaultProps: {
    description1: "TOTAL TRANSAKSI",
    description2: "TOTAL PENDAPATAN",
    fontWeight: "bold",
    servicePlaceId: "",
    date: "",
  },
  propDefinition: {
    description1: {
      group: "Design",
      type: "string",
      options: { format: "text" },
    },
    description2: {
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
    date: {
      type: "string",
      options: {
        format: "text",
      },
    },
  },
  Component: (props) => {
    const client = props.hooks.useClient()

    const description1 = props.hooks.useTemplate(props.properties.description1)
    const description2 = props.hooks.useTemplate(props.properties.description2)

    const fontWeight = props.hooks.useTemplate(props.properties.fontWeight)

    const servicePlaceIdFilter = props.hooks.useTemplate(props.properties.servicePlaceId)
    const dateFilter = props.hooks.useTemplate(props.properties.date)

    const [totalTransactions, setTotalTransactions] = React.useState('0')
    const [totalIncome, setTotalIncome] = React.useState('0')

    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
      fetchData()
    }, [servicePlaceIdFilter, dateFilter])

    const fetchData = async () => {
      setLoading(true)
      try {
        let servicePlaceId = servicePlaceIdFilter ? servicePlaceIdFilter : 0
        let date = dateFilter ? new Date(dateFilter) : new Date()

        let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
        let month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
        let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);

        const response = await client.project.axios({
          method: 'post',
          headers,
          url: `${url}/v1/rawsql`,
          data: {
            query: `SELECT COUNT(id) as total_transaction, SUM(grand_total) as total_income, DATE(created_at) as date FROM carts WHERE service_place_cart = '${servicePlaceId}' AND DATE(created_at) = '${year}-${month}-${day}' AND payment_status = 'PAID' GROUP BY DATE(created_at)`
          }
        })

        if (response.data.result.length > 0) {
          setTotalIncome(response.data.result[0].total_income)
          setTotalTransactions(response.data.result[0].total_transaction)
        } else {
          setTotalIncome('0')
          setTotalTransactions('0')
        }
      } catch (error) {
        console.log(error.message)
        setTotalIncome('0')
        setTotalTransactions('0')
      }
      setLoading(false)
    }

    return (
      <Box padding={4}>
        <SimpleGrid columns={2} spacing={2}>
          <Text fontSize="lg">
            {description1}
          </Text>
          <Text fontSize="lg" textAlign={'right'} fontWeight={fontWeight}>
            {loading ? 'Loading...' : `${totalTransactions}`}
          </Text>
          <Text fontSize="lg">
            {description2}
          </Text>
          <Text fontSize="lg" textAlign={'right'} fontWeight={fontWeight}>
            {loading ? 'Loading...' : `${formatRupiah(totalIncome)}`}
          </Text>
        </SimpleGrid>
      </Box>
    )
  }
})