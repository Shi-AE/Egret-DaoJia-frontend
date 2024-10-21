export interface businessConfig {
  name: string
  id: string
  dispatchPerRoundInterval: number
  institutionReceiveOrderMax: number
  institutionServeRadius: number
  seizeTimeoutInterval: number
  staffReceiveOrderMax: number
  staffServeRadius: number
  dispatchStrategy: number
  edjCityId: number | string
}
