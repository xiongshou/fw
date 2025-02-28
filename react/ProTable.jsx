import { ProTable } from '@ant-design/pro-components';
import React, { useState, useEffect, useRef } from 'react';
import { Button, Tag, DatePicker } from 'antd';
import { request } from 'ice';
const { RangePicker } = DatePicker;
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/zh_CN';


const FaultStore = () => {
    const [tagList, setTagList] = useState([]);
    const [faultLevelList, setFaultLevelList] = useState([]);

    const MODAL_TYPE = {
      CREATE: 'create',
      EDIT: 'edit',
      DETAIL: 'detail',
      NONE: 'none'
    };

      useEffect(() => {
        request(`/xxx`).then((res) => {
          setFaultLevelList(res?.data || []);
        });
      }, []);
    
      useEffect(() => {
        request(`/xxx`).then((res) => {
          setTagList(res?.data);
        });
      }, []);


    const columns = [
        {
            title: '故障名称',
            dataIndex: 'faultName',
            width: 200,
            fixed: 'left',
        },
        {
            title: '故障等级',
            dataIndex: 'faultLevel',
            width: 100,
            valueType: 'select',
            fieldProps: {
                mode: 'multiple',
                onSearch: (async (keyword) => {
                    request(`/xxxl=${keyword}`).then((res) => {
                        let resp = res?.data.filter((item) => item.includes(keyword))
                        setFaultLevelList(resp || []);
                    });
                }),
                options: faultLevelList || [],
                showSearch: true,
                filterOption: false,
            }
        },
        {
            title: '相关人',
            dataIndex: 'related',
            width: 200,
            render: (tags) =>
              tags && tags?.length > 0
                ? tags?.map((item) => {
                    const value = item.match(/\((.*?)\)/)?.[1];
                    return value ? <Tag key={value}>{value}</Tag> : null;
                  })
                : '',
            renderFormItem: () => {
                return <StaffSelect placeholder="请输入" labelInValue mode="multiple" />;
            },
            transform: (value) => {
                let res = value?.map((item) => `${item?.label}:${item?.key}`);
                return {
                  related: res
                };
            }
        },
        {
            title: '故障标签',
            dataIndex: 'faultStoreTagAndValues',
            hideInTable: true,
            width: 200,
            valueType: 'select',
            transform: (value) => {
              let res = value?.map((item) => ({ 
                tagDescAndValue: item
              }));
              return {
                faultStoreTagAndValues: res
              };
            },
            fieldProps: {
              mode: 'multiple',
              onSearch: (async (keyword) => {
                request(`/fault/listTags?tag=${keyword}`).then((res) => {
                    setTagList(res?.data || []);
                });
              }),
              options: tagList.map((item) => ({ value: item?.tagDescAndValue, label: item?.tagDescAndValue })) || [],
              showSearch: true,
              filterOption: false,
            }
        },
        {
            title: '故障时间',
            dataIndex: 'gmtCreate',
            width: 200,
            hideInTable: true,
            search:{},
            renderFormItem: () => (
              <RangePicker
                locale={locale}
                showTime
           
              />
            ),
            transform: (value) => {
              if (value?.[0] && value?.[1]) {
                return {
                  faultBeginTimeRangeStart: dayjs(value[0]).format('YYYY-MM-DD HH:mm:ss'),
                  faultBeginTimeRangeEnd: dayjs(value[1]).format('YYYY-MM-DD HH:mm:ss'),
                };
              }
              return {}; 
            }
        },
        {
            title: '应用标签',
            dataIndex: 'appTags',
            hideInSearch: true,
            width: 200,
            render: (tags) => (tags ? tags?.map((item) => <Tag>{item}</Tag>) : ''),
          },
          {
            title: '业务域标签',
            dataIndex: 'bizTags',
            width: 200,
            hideInSearch: true,
            render: (tags) => (tags ? tags?.map((item) => <Tag>{item}</Tag>) : ''),
          },
          {
            title: '风险标签',
            dataIndex: 'riskTags',
            width: 200,
            hideInSearch: true,
            render: (tags) => (tags ? tags?.map((item) => <Tag>{item}</Tag>) : ''),
          },
          {
            title: '大促时段标签',
            dataIndex: 'stepTags',
            width: 200,
            hideInSearch: true,
            render: (tags) => (tags ? tags?.map((item) => <Tag>{item}</Tag>) : ''),
          },
          {
            title: '舆情标签',
            dataIndex: 'publicOpinionTags',
            width: 200,
            hideInSearch: true,
            render: (tags) => (tags ? tags?.map((item) => <Tag>{item}</Tag>) : ''),
          },
          {
            title: '自定义标签',
            dataIndex: 'otherTags',
            width: 200,
            hideInSearch: true,
            render: (tags) => (tags ? tags?.map((item) => <Tag>{item}</Tag>) : ''),
          },
          {
            title: '故障相关钉钉文档',
            dataIndex: 'dingDoc',
            copyable: true,
            ellipsis: true,
            width: 200,
            hideInSearch: true,
          },
          {
            title: '故障回放用例集ID',
            dataIndex: 'invokeCaseId',
            hideInSearch: true,
            width: 200,
          },
          {
            title: 'tr链接',
            dataIndex: 'trUrl',
            copyable: true,
            ellipsis: true,
            hideInSearch: true,
            width: 200,
          },
          {
            title: '故障开始时间',
            dataIndex: 'faultBeginTime',
            width: 200,
            hideInSearch: true,
          },
          {
            title: '故障响应时间',
            dataIndex: 'faultRespondTime',
            width: 200,
            hideInSearch: true,
          },
          {
            title: '故障开始恢复时间',
            dataIndex: 'faultRecoverTime',
            width: 200,
            hideInSearch: true,
          },
          {
            title: '故障结束时间',
            dataIndex: 'faultEndTime',
            width: 200,
            hideInSearch: true,
          },
          {
            title: '操作',
            valueType: 'option',
            width: 200,
            hideInSearch: true,
            render: (_, record) => (
                <div>
                    <tag>编辑</tag>
                    <tag>删除</tag>
                    <tag>详情</tag>
                </div>
            )
          },
    ];


    return (
        <div>
            <ProTable
            form={
              {
                labelCol: { span: 8 },   
                wrapperCol: { span: 16 }, 
                span: 8
              }
            }
            search={{
              defaultCollapsed: false,
              collapseRender: () => null,
              optionRender: (searchConfig, formProps, dom) => [
                <Button
                  type="primary"
                  key="export"
                >
                  新增
                </Button>,
                ...dom,
              ],
            }}
                columns={columns}
                request={async (params) => {
                  let transFormParams = {
                    ...params,
                    pageNo: params.current,
                  }
                  let resp = await request.post(`/xxx`, transFormParams);;
                  return {
                    data: resp?.elements || [], 
                    total: resp?.totalCount || 0,
                    success: resp?.code === 0
                  };
                }}
                options={false}
                rowKey={(record) => record.id}
                scroll={{
                  x: () => {
                    let num = 0;
                    columns?.forEach((item) => {
                      num += item?.width;
                    });
                    return num;
                  },
                }}
            />
        </div>
    );
    
}
 
export default FaultStore;
