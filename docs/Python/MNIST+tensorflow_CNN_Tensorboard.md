# MNIST+tensorflow卷积神经网络+tensorboard初次使用

#### 于2019年12月8日2019年12月8日由[**crazyxt**](https://crazyxt.com/?author=1)发布

```
#coding:utf8
import tensorflow as tf
import numpy as np
import pandas as pd
import tensorflow.examples.tutorials.mnist.input_data as input_data
mnist=input_data.read_data_sets('MNIST_data/',one_hot=True) #一个one-hot向量除了某一位的数字是1以外其余各维度数字都是0


#以下为随机梯度下降代码：
'''
x=tf.placeholder(tf.float32,[None,784])
w=tf.Variable(tf.zeros([784,10]))
b=tf.Variable(tf.zeros([10]))
y=tf.nn.softmax(tf.matmul(x,w)+b)
y_=tf.placeholder("float",[None,10])
cross_entropy=-tf.reduce_sum(y_*tf.log(y)) #用交叉熵来作为损失函数
train_step=tf.train.GradientDescentOptimizer(0.01).minimize(cross_entropy)
init=tf.global_variables_initializer()
sess=tf.Session()
sess.run(init)
# for i in range(1000):
#     print i
#     batch_xs,batch_ys=mnist.train.next_batch(100) #随机抓取100个数据作为随机梯度下降数据集
#     sess.run(train_step,{x:batch_xs,y_:batch_ys})
#     print sess.run(b)
# correct_prediction=tf.equal(tf.argmax(y,1),tf.argmax(y_,1))
# accuracy=tf.reduce_mean(tf.cast(correct_prediction,"float"))
# print sess.run(accuracy,{x:mnist.test.images,y_:mnist.test.labels})
'''

#以下为卷积NN操作:
'''
这个卷积神经网络的结构为：
第一层卷积+max pooling
第二层卷积+max pooling
一个全连接层+dropout
输出层
'''
x=tf.placeholder(tf.float32,[None,784],name='x_input')
w=tf.Variable(tf.zeros([784,10]),name='w_input')
b=tf.Variable(tf.zeros([10]),name='b_input')
y=tf.nn.softmax(tf.matmul(x,w)+b)
y_=tf.placeholder("float",[None,10],name='y_-input')
cross_entropy=-tf.reduce_sum(y_*tf.log(y)) #用交叉熵来作为损失函数
train_step=tf.train.GradientDescentOptimizer(0.01).minimize(cross_entropy)
init=tf.global_variables_initializer()
sess=tf.Session()
sess.run(init)
def variable_summaries(var): #定义变量
    """Attach a lot of summaries to a Tensor (for TensorBoard visualization)."""
    with tf.name_scope('summaries'):
      # 计算参数的均值，并使用tf.summary.scaler记录
      mean = tf.reduce_mean(var)
      tf.summary.scalar('mean', mean)

      # 计算参数的标准差
      with tf.name_scope('stddev'):
        stddev = tf.sqrt(tf.reduce_mean(tf.square(var - mean)))
      # 使用tf.summary.scaler记录记录下标准差，最大值，最小值
      tf.summary.scalar('stddev', stddev)
      tf.summary.scalar('max', tf.reduce_max(var))
      tf.summary.scalar('min', tf.reduce_min(var))
      # 用直方图记录参数的分布
      tf.summary.histogram('histogram', var)
      
def weight_variable(shape): #定义两个初始化操作函数，权重和偏置
    initial=tf.truncated_normal(shape,stddev=0.1) #产生截断正态分布函数，标准差0.1(太小太大最后的精度差很多)
    return tf.Variable(initial)
def bias_variable(shape):
    initial=tf.constant(0.1,shape=shape)
    return tf.Variable(initial)
def conv2d(x,w):
    #conv2d(输入图像，卷积核，stride，padding)
    return tf.nn.conv2d(x,w,strides=[1,1,1,1],padding='SAME') #stride，4维，对于图片一般两维，一般取[1,stride,stride,1,]，中间两个1代表padding时在x方向运动一步，y方向运动一步
def max_pool_2x2(x):
    #maxpooling，这里使用了2x2的max pooling核函数，步长2x2，pooling后图像尺寸压缩一半。
    return tf.nn.max_pool(x,ksize=[1,2,2,1],strides=[1,2,2,1],padding='SAME') #padding的SAME方式保持和原图像尺寸一致，边角进行零填充，若不填充，图像会逐渐缩小
#第一层卷积：
with tf.name_scope('w_conv1'): 用name_scope()方法创建变量name，调用前面的weight_variable函数。
    w_conv1=weight_variable([5,5,1,32])#卷积核patch为5x5，输入1个通道，输出32个feature map(超参，自己定义)
    variable_summaries(w_conv1)
with tf.name_scope('b_conv1'):
    b_conv1=bias_variable([32]) #和输出个数保持一样
    variable_summaries(b_conv1)
with tf.name_scope('input_reshape'):
    x_image=tf.reshape(x,[-1,28,28,1]) #-1表示先不考虑输入图片例子维度, 将上一个输出结果展平，28x28位图像尺寸，1是黑白图像的输入通道数
    tf.summary.image('input_image', x_image, 10) #命名，参数名，展示张数
h_conv1=tf.nn.relu(conv2d(x_image,w_conv1)+b_conv1) #Relu激活函数处理，可理解为特征加强，输出图像28x28x32，softmax效果很差。
tf.summary.histogram('activations', h_conv1)
h_pool1=max_pool_2x2(h_conv1) #经过pooling后，图像尺寸缩小，14x14x32
tf.summary.histogram('h_pool1',h_pool1) #这种方法也可以直接为变量创建histogram，只不过在tensorboard中是直接显示定义的名称

#第二层卷积：
w_conv2=weight_variable([5,5,32,64]) #卷积核patch的大小是5x5，有32个featuremap所以输入是32，输出定为64.
tf.summary.histogram('w_conv2', w_conv2)
b_conv2=bias_variable([64])
tf.summary.histogram('b_conv2', b_conv2)

with tf.name_scope('h_conv2'):
    h_conv2=tf.nn.relu(conv2d(h_pool1,w_conv2)+b_conv2)
    variable_summaries(h_conv2)
h_pool2=max_pool_2x2(h_conv2) #经过pooling后，图像尺寸缩小，
tf.summary.histogram('h_pool2',h_pool2)
# # #第三层卷积：
# w_conv3=weight_variable([5,5,64,128])
# b_conv3=bias_variable([128])
# h_conv3=tf.nn.relu(conv2d(h_pool2,w_conv3)+b_conv3)
# #h_pool3=max_pool_2x2(h_conv3)
# #第四层卷积：
# w_conv4=weight_variable([5,5,128,64])
# b_conv4=bias_variable([64])
# h_conv4=tf.nn.relu(conv2d(h_conv3,w_conv4)+b_conv4)
# h_pool4=max_pool_2x2(h_conv4) #7x7x64。
#全连接层：
w_fc1=weight_variable([7*7*64,1024]) #此时weight_variable的shape输入就是第二个卷积层展平了的输出大小: 7x7x64，输出size定为1024
b_fc1=bias_variable([1024])
h_pool2_flat=tf.reshape(h_pool2,[-1,7*7*64]) #将第二层卷积的h_pool2的输出值从一个三维的变为一维的数据。
h_fc1=tf.nn.relu(tf.matmul(h_pool2_flat,w_fc1)+b_fc1) #相乘计算后进行Relu处理
tf.summary.histogram('h_fc1',h_fc1)
#Dropout防止过拟合:
with tf.name_scope('dropout'):
    keep_prob=tf.placeholder('float') #Dropout概率
    tf.summary.scalar('dropout_keep_probability', keep_prob) #创建二维分布图
    h_fc1_drop=tf.nn.dropout(h_fc1,keep_prob)
#输出层：
w_fc2=weight_variable([1024,10]) #输入1024，输出10个类
b_fc2=bias_variable([10])
y_conv=tf.nn.softmax(tf.matmul(h_fc1_drop,w_fc2)+b_fc2) #用softmax分类器，多分类，输出是各个类的概率。
#训练和评估：
cross_entropy=-tf.reduce_sum(y_*tf.log(y_conv)) #交叉熵损失函数来定义cost function。
tf.summary.scalar('loss', cross_entropy)
train_step=tf.train.AdamOptimizer(1e-4).minimize(cross_entropy)
correct_prediction=tf.equal(tf.arg_max(y_conv,1),tf.arg_max(y_,1))
accuracy=tf.reduce_mean(tf.cast(correct_prediction,'float'))
tf.summary.scalar('accuracy', accuracy)

# summaries合并
merged = tf.summary.merge_all()
# 写到指定的磁盘路径中
train_writer = tf.summary.FileWriter('log/train', sess.graph)
test_writer = tf.summary.FileWriter('log/test')

sess.run(tf.global_variables_initializer())
import time
start=time.time()
for i in range(100):
    batch=mnist.train.next_batch(50)
    if i%10==0:
        print "step:",i,
        print ",accuracy:",sess.run(accuracy,{x:batch[0],y_:batch[1],keep_prob:1.0})
    sess.run(train_step,{x:batch[0],y_:batch[1],keep_prob:0.2})

    #这一步不要忘了：
    result=sess.run(merged,{x:batch[0],y_:batch[1],keep_prob:1.0})
    train_writer.add_summary(result,i)
    
train_writer.close()
print "Test accuracy:",sess.run(accuracy,{x:mnist.test.images,y_:mnist.test.labels,keep_prob:1.0})
print "Time:",time.time()-start
'''
#以下代码用于保存模型。
saver=tf.train.Saver()
sess.run(init)
save_path=saver.save(sess,"mytrain/test.ckpt") #后缀meta文件保存整个tensorflow graph，.data文件保存训练的variables
sess.close()
print "save to path",save_path

sess=tf.Session() #会话前面已关闭，这里需要重新开启
saver=tf.train.import_meta_graph('mytrain/test.ckpt.meta') #导入前面创建的网络
saver.restore(sess,tf.train.latest_checkpoint('./mytrain/')) #加载模型
print sess.run(accuracy,{x:mnist.test.images,y_:mnist.test.labels,keep_prob:1.0}) #测试模型
sess.close()
'''
##最后训练完成之后，输入命令：tensorboard --logdir=log/即可按照提示地址打开tensorboard图表。
##MAC运行方式:

python /Library/Frameworks/Python.framework/Versions/2.7/lib/python2.7/site-packages/tensorboard/main.py --logdir=log/
```