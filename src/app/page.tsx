"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { typeList, zoneLIst } from "./config"
import { Badge } from "@/components/ui/badge"
import { isNaN, keys, mapValues } from 'lodash'

const dynSchema = {
  load: z.string().trim().refine(v => !isNaN(Number(v)), { message: '必须是数字' }).refine(v => Number(v) >= 200 && Number(v) <= 10000, { message: '必须在200-10000之间' }),
  width: z.string().trim().refine(v => !isNaN(Number(v)), { message: '必须是数字' }).refine(v => Number(v) >= 1000 && Number(v) <= 2000, { message: '必须在1000-2000之间' }),
  height: z.string().trim().refine(v => !isNaN(Number(v)), { message: '必须是数字' }).refine(v => Number(v) >= 1000 && Number(v) <= 2500, { message: '必须在1000-2500之间' }),
}

const baseSchema = {
  companyName: z.string().trim().min(1, { message: '必填' }),
  zone: z.string().min(1, { message: '必填' }),
  tel: z.string().trim().max(100, { message: '最长100位' }).refine(v => !isNaN(Number(v)), { message: '必须是数字' }),
  address: z.string().trim().max(100, { message: '最长100位' }).min(1, { message: '必填' }),
  billAddress: z.string().trim().min(1, { message: '必填' }).max(100, { message: '最长100位' }),
  type: z.string().min(1, { message: '必填' }),
}

const fullSchema = {
  ...baseSchema, ...dynSchema
}
export default function Home() {
  const fullScheamObj = z.object(fullSchema)
  const form = useForm<z.infer<typeof fullScheamObj>>({
    resolver: zodResolver(fullScheamObj),
    defaultValues: { companyName: '', tel: '', address: '', billAddress: '', load: '', width: '', height: '' },
    shouldUnregister: true,
    mode: 'onChange'
  })

  const { control, getValues, setValue, trigger, watch } = form;
  const show = watch('type') === 'Passenger_Elevator'

  return (
    <Form {...form}>
      <form className="w-2/3 space-y-6" style={{ marginTop: '50px', marginLeft: '50px' }}>
        <FormMessage />
        <div className="flex flex-wrap -mx-4">
          {/* 公司名称 */}
          <div className="w-1/3 px-4 mb-4">
            <FormField
              control={control}
              name={'companyName'}
              render={({ field }) => {
                return <FormItem>
                  <FormLabel>公司名称</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              }}
            />
          </div>

          {/* 电话区号 */}
          <div className="w-1/3 px-4 mb-4">
            <FormField
              control={control}
              name={'zone'}
              render={({ field }) => {
                return <FormItem>
                  <FormLabel>电话区号</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger style={{ width: '100%' }}>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {zoneLIst?.map(z => <SelectItem key={`${z.value}-${z.label}`} value={z.value}>{z.label} {z.value}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              }}
            />
          </div>

          {/* 电话号码 */}
          <div className="w-1/3 px-4 mb-4">
            <FormField
              control={control}
              name={'tel'}
              render={({ field }) => {
                return <FormItem>
                  <FormLabel>电话号码</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              }}
            />
          </div>

          {/* 公司地址 */}
          <div className="w-1/3 px-4 mb-4">
            <FormField
              control={control}
              name={'address'}
              render={({ field }) => {
                return <FormItem>
                  <FormLabel>公司地址</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              }}
            />
          </div>

          {/* 账单地址 */}
          <div className="w-1/3 px-4 mb-4">
            <FormField
              control={control}
              name={'billAddress'}
              render={({ field }) => {
                return <div>
                  <FormItem>
                    <FormLabel>账单地址</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                </div>
              }}
            />
            <Button onClick={(event) => {
              event.preventDefault();
              trigger(['address']).then(res => {
                if (res) {
                  const { address } = getValues()
                  setValue('billAddress', address)
                  trigger(['billAddress'])
                }
              })
            }}>填入公司地址</Button>
          </div>

          {/* 产品类型 */}
          <div className="w-1/3 px-4 mb-4">
            <FormField
              control={control}
              name={'type'}
              render={({ field }) => {
                return <FormItem>
                  <FormLabel>产品类型</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger style={{ width: '100%' }}>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {typeList?.map(z => <SelectItem key={`${z.value}-${z.label}`} value={z.value}>{z.label} {z.value}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              }}
            />
          </div>

          {show && <>
            {/* 载重 */}
            <div className="w-1/3 px-4 mb-4">
              <FormField
                control={control}
                name={'load'}
                render={({ field }) => {
                  return <FormItem >
                    <FormLabel>载重(千克)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                }}
              />
              填入: {['630', '1000', '1250']?.map(n => <Badge key={n} onClick={() => setValue('load', n)}>{n}</Badge>)}
            </div>
            {/* 轿厢宽度(毫米) */}
            <div className="w-1/3 px-4 mb-4">
              <FormField
                control={control}
                name={'width'}
                render={({ field }) => {
                  return <FormItem >
                    <FormLabel>轿厢宽度(毫米)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                }}
              />
              {watch('load') === '630' &&
                <>
                  填入：<Badge onClick={() => setValue('width', '1100')}>1100</Badge>
                </>
              }
              {watch('load') === '1000' &&
                <>
                  填入：<Badge onClick={() => setValue('width', '1200')}>1200</Badge>
                </>
              }
              {watch('load') === '1250' &&
                <>
                  填入：<Badge onClick={() => setValue('width', '1200')}>1200</Badge><Badge onClick={() => setValue('width', '1600')}>1600</Badge>
                </>
              }
            </div>

            {/* 轿厢高度(毫米) */}
            <div className="w-1/3 px-4 mb-4">
              <FormField
                control={control}
                name={'height'}
                render={({ field }) => {
                  return <FormItem >
                    <FormLabel>轿厢高度(毫米)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                }}
              />
              {watch('load') === '630' &&
                <>
                  填入：<Badge onClick={() => setValue('height', '1400')}>1400</Badge>
                </>
              }
              {watch('load') === '1000' &&
                <>
                  填入：<Badge onClick={() => setValue('height', '2100')}>2100</Badge>
                </>
              }
              {watch('load') === '1250' && watch('width') === '1200' &&
                <>
                  填入：<Badge onClick={() => setValue('height', '2100')}>2100</Badge>
                </>
              }
              {watch('load') === '1250' && watch('width') === '1600' &&
                <>
                  填入：<Badge onClick={() => setValue('height', '1400')}>1400</Badge>
                </>
              }
            </div>
          </>}
        </div>
        <Button type="submit" onClick={e => {
          e.preventDefault()
          const triggerField = show ? keys(fullSchema) : keys(baseSchema)
          trigger(triggerField).then(res => {
            if (res) {
              const formData = getValues()
              console.log('success: ', formData)
            }
          })
        }}>提交</Button>
      </form>
    </Form >
  )
}
