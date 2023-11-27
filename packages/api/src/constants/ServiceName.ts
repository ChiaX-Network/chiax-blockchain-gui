const ServiceName = {
  WALLET: 'xxch_wallet',
  FULL_NODE: 'xxch_full_node',
  FARMER: 'xxch_farmer',
  HARVESTER: 'xxch_harvester',
  SIMULATOR: 'xxch_full_node_simulator',
  DAEMON: 'daemon',
  PLOTTER: 'xxch_plotter',
  TIMELORD: 'xxch_timelord',
  INTRODUCER: 'xxch_introducer',
  EVENTS: 'wallet_ui',
  DATALAYER: 'xxch_data_layer',
  DATALAYER_SERVER: 'xxch_data_layer_http',
} as const;

type ObjectValues<T> = T[keyof T];

export type ServiceNameValue = ObjectValues<typeof ServiceName>;

export default ServiceName;
