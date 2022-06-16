export interface UserInterface {
  id?: number;
  username: string;
  password: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  imageUrl: string;
  authority?: string;
}

export class ResponseObject {
  status: string;
  message: string;
  data: string;
}

export interface CategoryInterface {
  cId: number,
  name: string
}

export interface ManufacturerInterface {
  id: number,
  name: string
}

export interface ImageProductsInterface {
  ip_id: number,
  imageUrl: string
}

export interface ProductDtoInterface {
  pid: number,
  name: string,
  cpu: string,
  gpu: string,
  hardDiskDrive: string,
  ramdisk: string,
  monitors: string,
  batteryCapacity: string,
  warranty: string,
  insights: string,
  keyboardLights: string,
  design: string,
  sizeAndWeight: string,
  launchDate: number,
  operatingSystem: string,
  gateway: string,
  price: number;
  active: boolean,
  imageMain: string,
  manufacturer: ManufacturerInterface,
  category: CategoryInterface,
  imageUrl: ImageProductsInterface[];
}

export interface OrderInterface {
  oid?: number,
  deliveryAddress: Date | null,
  notes: string,
  recipientName: string,
  phoneNumber: string,
  orderDate: Date | null,
  deliveryDate: Date | null,
  recipientDate: Date | null,
  status: string,
  total: number,
  userOrder: UserInterface,
  product: ProductDtoInterface,
  quantity: number
}

export interface OrderDetailsInterface {
  orderDetailsId: number,
  price: number,
  quantity: number
  product: ProductDtoInterface | null,
  order: OrderInterface | null
}

export interface OrderDtoInterface {
  oid: number,
  deliveryAddress: Date,
  notes: string,
  recipientName: string,
  phoneNumber: string,
  orderDate: Date,
  deliveryDate: Date
  recipientDate: Date,
  status: string,
  total: number,
  userOrder: UserInterface,
  orderDetailsList: OrderDetailsInterface[];
}

export interface ShipperOrderInterface {
  shipperOrderId: number | undefined,
  order: OrderDtoInterface,
  shipperUser: UserInterface,
  applicationTime: Date,
  total: number,
  reasonRTGs: string
}

export interface ShipperOrderDtoInterface {
  shipperOrderId: number,
  order: OrderDtoInterface,
  shipperUser: any,
  applicationTime: Date,
  total: number,
  reasonRTGs: string
  orderDetailsList: OrderDetailsInterface[]
}

export interface CommentInterface {
  commentId: number,
  content: string,
  commentDate: Date,
  user: UserInterface,
  product: {
    pid: number
  }
}

export interface CommentDetailsInterface {
  cDetailsID: number,
  content_reply: string,
  commentDateReply: Date,
  comment: {
    commentId: number,
  }
  userReply: UserInterface,
  user: UserInterface
}

export interface CommentDtoInterface {
  commentId: number,
  content: string,
  commentDate: Date,
  user: UserInterface,
  product: ProductDtoInterface
  commentDetailsList: CommentDetailsInterface[],
}
