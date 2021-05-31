- 查看系统用户

- ```
  grep bash /etc/passwd
  ```

- 添加用户：

- ```
  adduser
  ```

- 查看php状态

- ```
   systemctl status php7.0-fpm.service
  ```

- ```
  #wp-config.php数据库配置：
  define( 'DB_NAME', 'wordpress' );
  
  /** MySQL database username */
  define( 'DB_USER', 'wordpress' );
  
  /** MySQL database password */
  define( 'DB_PASSWORD', 'wsXT1225' );
  
  /** MySQL hostname */
  define( 'DB_HOST', 'localhost' );
  
  /** Database Charset to use in creating database tables. */
  define( 'DB_CHARSET', 'utf8' );
  
  /** The Database Collate type. Don't change this if in doubt. */
  define( 'DB_COLLATE', '' );
  ```

- php7.0配置：

  - 路径：`/etc/php/7.0/fpm/pool.d/www.conf`
  - 将owener 和group改为www-data

