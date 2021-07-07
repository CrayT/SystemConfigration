# python读取各种文件方式

#### 于2019年12月8日2019年12月8日由[**crazyxt**](https://crazyxt.com/?author=1)发布

1,Json：

```
use_time=[]
with open(address,'r') as f: #ubuntu
    mobile = json.load(f)
    calls = mobile["transactions"][0]["calls"]
for call in calls: 
  use_time.append(str(call['use_time']))
```

2,Excel:

```
rawdata1=open_workbook(address)
rawdata=rawdata1.sheet_by_index(0)
for i in range(1,rawdata.nrows):
    if rawdata.cell(i,date_index).value=="": #跳过空行
        continue
    else:
        if ctype==3:  #若为3，则用datetime模块处理日期
            date1=rawdata.cell(i,date_index).value
            date2 = xldate_as_tuple(date1,0) 
            date3=datetime(*date2)
            if "." in str(rawdata.cell(i,phone_index).value):
                phone1=str(rawdata.cell(i,phone_index).value)[:-2]  
            else:
                phone1=str(rawdata.cell(i,phone_index).value)
```

3,写EXCEL：

```
Excel_file = xlwt.Workbook() 
sheet = Excel_file.add_sheet('sheet0')
header=[u'号码','日期top1','日期top2','日期top3']
#写入标题行：
for i in range(len(header)):
    sheet.write(0,i,header[i])
#开始按行写入数据：
for i in range(len(phonelist)):
    sheet.write(i+1,0,phonelist[i])
    sheet.write(i+1,1,dic[str(phonelist[i])])
#保存EXCEL：
Excel_file.save("C:/Users/Desktop/100个文件输出xls/"+str(fileName)+".xls")
```

4,CSV：

```
rawdata=pd.read_csv(address,skip_blank_lines=True) #参数为去除空行
if 'start_time' or 'begin_time'  in rawdata.columns:
    if 'start_time' in rawdata.columns:
        start_time=rawdata['start_time']
    elif 'begin_time' in rawdata.columns:
            start_time=rawdata['begin_time']
```

5,txt:

```
rawdata=open(address,'r')
i=0
a=[] #c存放第一行的列名
for line in rawdata:
    if i==1: #默认第二行开始存储通话数据
        a=line.split(',') #逗号作为分隔符
        for j in range(len(a)): #查找指定列名所在的列下标
            if (('-' in str(a[j]))or('/' in str(a[j]))): #判断日期所在列数
                date_index=j #保存日期的列下标
            elif  str(a[j]).isdigit() and len(str(a[j]))>5: #默认全为数字组成的字符串为电话号码
                phone_index=j
            else:
                pass
        break
    else:
        i+=1
i=0
for line in rawdata:#开始转存数据：
    if len(line)<10: #跳过空行
        continue
    data_line=line.split(',') #txt默认以','分隔数据
    if i==0:
        pass #第一行为列名，跳过
        i+=1
    else: #从第二行开始保存数据
        start_time.append(data_line[date_index])
```