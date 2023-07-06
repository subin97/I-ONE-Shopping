const express = require('express');
const app = express(); app.set('port', process.env.PROT || 3000);
const bodyParser = require('body-Parser');
app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');
const methodOverride = require('method-override');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session()); 

app.use(methodOverride('_method'));
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb+srv://tchaiko77:1234@cluster0.o7n5jsz.mongodb.net/', function(error, client){

    if(error){return console.log(error)};

    db = client.db('oneshopping');

    // db 더미 정보 저장
    // db.collection('user').insertOne({id : 'leechan', password : 'damdam'}, function(error, result){
    //     console.log('Save Success');
    // });
    // db.collection('user').insertOne({id : 'leechan', password : 'damdam', _id : 9999}, function(error, result){
    //     console.log('Save Success');
    // });

    // 응답 대기
    app.listen(app.get('port'), () => {
        console.log(app.get('port'), 'port waiting')
    });

});

// 추가 기능들
// const cookieParser = require('cookie-parser');
// const session = require('express-session');
// app.use(express.json());
// app.use(express.urlencoded({extended: false}));
// app.use(cookieParser(process.env.COOKIE_SECRET));
// app.use(session({
//     resave: false,
//     saveUninitialized: false,
//     secret: process.env.COOKIE_SECRET,
//     cookie:{
//         httpOnly:true,
//         secure:false,
//     },
//     name: 'session-cookie'
// }));

// 기본 주소 세팅
// get
app.get('/', (req, res) => {
    
    // db에서 모든 정보 넘길 때
    db.collection('product').find().toArray(function(error, 응답){ // 모든 데이터를 찾을때
        console.log(res);
        res.render('home.ejs', {productInfo : 응답}); // 결과인 res를 unserInfo라는 이름으로 전해준다.
    }); 

    //res.sendFile(__dirname + '/home.html');
});

app.get('/login', (req, res) => { // get은 무언가를 받아올때
    res.sendFile(__dirname + '/login.html');
});

app.get('/loginDefault', (req, res) => {
    res.sendFile(__dirname + '/loginDefault.html');
});

// 내 정보 보기. ejs 파일 보여주기. ejs파일은 view안에 생성
app.get('/myData', 로그인여부, (요청, 응답) => {

    // 로그인 한다음에 세션이 잇으면 요청.user가 항상 있음.
    응답.render('myData.ejs', {userInfo : 응답})
});

app.get('/Cart', (req, res) => {
  db.collection('cart').find().toArray(function(error, 응답){ // 모든 데이터를 찾을때
      console.log(res);
      res.render('cart.ejs', {cartInfo : 응답});
  }); 
});

app.get('/editMyData', (요청, 응답) => {

  // 문자형 id로 찾아오기.    
  db.collection('user').findOne({_id : 요청.user.id}, function(에러, 결과)
  {
      응답.render('editMyData.ejs', {userInfo : 요청.user})
  })
});


app.get('/greenTshirtDetail', (요청, 응답) => {
  응답.render('greenTshirtDetail.ejs')
});


app.get('/grayTshirtDetail', (요청, 응답) => {
  응답.render('grayTshirtDetail.ejs')
});

function 로그인여부(요청, 응답, next)
{
    if(요청.user)
    {
        next() //다음으로 통과
    }
    else
    {
        응답.send('로그인 해주세요')
    }
}

// 내 정보 수정
app.get('/editMyData', (요청, 응답) => {

    // 문자형 id로 찾아오기.    
    db.collection('user').findOne({_id : 요청.user.id}, function(에러, 결과)
    {
        응답.render('editMyData.ejs', {userInfo : 요청.user})
    })
});

// 관리자 계정
app.get('/adminPage', (요청, 응답) => {
      응답.render('adminPage.ejs')
});

app.get('/adminLoginDefault', (요청, 응답) => {
  응답.render('adminLoginDefault.ejs')
});

app.get('/adminPage', (요청, 응답) => {
  응답.render('adminPage.ejs')
});

// post
app.post('/add', (req, res) =>{ //post는 무언가를 보낼때
    
    var _address = req.body.address1 + req.body.address2
    db.collection('user').insertOne(
        {
            name : req.body.name, 
            id : req.body.id,
            password : req.body.password, 
            birthdate : req.body.birthdate, 
            email : req.body.email, 
            phonenumber : req.body.phonenumber,
            zipcode : req.body.zipcode,
            address : _address
        }, 
        function(error, result){
        console.log('Save Success');
    });
    res.sendFile(__dirname + '/loginDefault.html');
});

// 상품 추가
app.post('/addProduct', (req, res) =>{

  res.send('상품추가완료');

  db.collection('product').insertOne(
      {
          productName : req.body.productName,
          productPrice : req.body.productPrice, 
          prodcutDetail : req.body.productDetail,
          productImageLink : req.body.productImageLink ,
          productDetailPagePath : './' + req.body.productName + 'Detail' 
          // ./greenTshirtDetail
      }, 
      function(error, result){
  });
});

app.post('/addGreen', (req, res) =>{
  db.collection('cart').insertOne(
      {
          id : 'greenTshirt',
          name : 'greenTshirt', 
          price : 30000,
          detail : '칼라의 형태가 쉽게 흐트러지지 않도록 만들어졌습니다.', 
          imageLink : 'https://simage-kr.uniqlo.com/display/corner/2162/L2_M_CATEGORY_TSHIRT_230324.jpg'
      }, 
      function(error, result){
  });
  res.send('전송완료')
});

app.post('/addGray', (req, res) =>{
  db.collection('cart').insertOne(
      {
          id : 'grayTshirt',
          name : 'grayTshirt', 
          price : 40000,
          detail : '앞뒷면의 실을 구분하여 사용했습니다.', 
          imageLink : 'https://simage-kr.uniqlo.com/display/corner/2162/L2_M_CATEGORY_POLO_230324.jpg'
      }, 
      function(error, result){
  });
  res.send('전송완료')
});

// post
app.post('/addOrder', (요청, 응답) =>{ //post는 무언가를 보낼때

    var _priceSum = 0;
    var _products = new Array();
    db.collection('user').findOne({_id : 요청.user.id}, function(에러, 결과)
    {
      // 총 가격 구하기
      db.collection('cart').find().toArray(function(error, 상품응답){ 
        
        상품응답.forEach(element => {
          _priceSum += element.price,
          _products.push(element.id)
      }); 

      // order 컬렉션 만들기
      db.collection('order').insertOne(
      {
          userID : 요청.user.id,
          userName : 요청.user.name,
          email : 요청.user.email,
          phonenumber : 요청.user.phonenumber,
          zipcode : 요청.user.zipcode,
          address : 요청.user.address,
          products : _products,
          priceSum : _priceSum,
          progress : '관리자 확인중'

          // adress : 요청.user.adress
      },
      function(error,result){
      })
      응답.render('orderSuccess.ejs', {userInfo : 요청.user})
    })
    }); 
  });

app.post('/order', 로그인햇니, (요청, 응답) =>{

  // 카트에 있는거 전부 가져와서
  // 문자형 id로 찾아오기.    
  console.log(요청.userInfo);
  db.collection('user').findOne({_id : 요청.user.id}, function(에러, 결과)
  {
      응답.render('order.ejs', {userInfo : 요청.user})
  })
}); 

function 로그인햇니(요청, 응답, next) { 
  if (요청.user) { 
    next() 
  } 
  else { 
    응답.send('로그인안함') 
  } 
} 

// 회원 정보
app.post('/update', (요청, res) =>{ //post는 무언가를 보낼때
  res.send('Update완료');
  console.log(요청.body);
  db.collection('user').updateOne(
      {id : 요청.body.id }, 
      {$set : { 
        password : 요청.body.password , 
        birthdate : 요청.body.birthdate,
        email : 요청.body.email,
        phonenumber : 요청.body.phonenumber
      }},
      function(error, result){
  });
});

app.delete('/deleteData', function(요청, 응답){
    //delete 요청시 요청 아이디 찾아서 삭제.
    db.collection('user').deleteOne(요청.id, function(에러, 결과){
        console.log('삭제성공');
    });
})

app.post('/moveSignInPage', (req, res) =>{ //post는 무언가를 보낼때
    res.sendFile(__dirname + '/logIn.html');
});

//로그인
app.post(
    '/loginRequest', 
    passport.authenticate('local', {failureRedirect : '/login'}), // 회원 인증 실패시 회원가입경로로
    function(요청, 응답){
        응답.redirect('/') // 성공하면 이 화면(home)으로 보내주세요
});

passport.use(new LocalStrategy({
    usernameField: 'id', // form에 아이디 값
    passwordField: 'password',
    session: true, // 세션정보 저장 여부
    passReqToCallback: false,
  }, function (입력한아이디, 입력한비번, done) {
    console.log(입력한아이디, 입력한비번);
    db.collection('user').findOne({ id: 입력한아이디 }, function (에러, 결과) {
        
      if (에러) 
      {
        return done(에러)
      }
      if (!결과) 
      {
        return done(null, false, { message: '존재하지않는 아이디' })
      }

      if (입력한비번 == 결과.password) 
      { // 아이디 잇으면 비밀번호 검증
        return done(null, 결과)
      } 
      else 
      {
        return done(null, false, { message: '비밀번호 틀렸어요' })
      }
    })
  }));

// 세션 등록(user는 위에 결과의 값이 담겨잇음)
passport.serializeUser(function (user, done) {
    done(null, user.id)
  });

  passport.deserializeUser(function (아이디, done) 
  {
    db.collection('user').findOne({ id: 아이디 }, function (에러, 결과) {
      done(null, 결과) // 결과는 db에서 찾은 id, pw..등등 값
    })
  });


//관리자 로그인
//관리자 로그인
app.post(
  '/adminLoginRequest', 
  passport.authenticate('local', {failureRedirect : '/'}), // 회원 인증 실패시 회원가입경로로
  function(요청, 응답){
      응답.redirect('/') // 성공하면 이 화면(home)으로 보내주세요
});

passport.use(new LocalStrategy({
  usernameField: 'id', // form에 아이디 값
  passwordField: 'password',
  session: true, // 세션정보 저장 여부
  passReqToCallback: false,
}, function (입력한아이디, 입력한비번, done) {
  console.log(입력한아이디, 입력한비번);
  if(입력한아이디.startsWith('admin'))
  {
    db.collection('adminUser').findOne({ id: 입력한아이디 }, function (에러, 결과) {
      
      if (에러) 
      {
        return done(에러)
      }
      if (!결과) 
      {
        return done(null, false, { message: '존재하지않는 아이디' })
      }
  
      if (입력한비번 == 결과.password) 
      { // 아이디 잇으면 비밀번호 검증
        return done(null, 결과)
      } 
      else 
      {
        return done(null, false, { message: '비밀번호 틀렸어요' })
      }
    })
  
  }
  else
  {
    db.collection('user').findOne({ id: 입력한아이디 }, function (에러, 결과) {
        
      if (에러) 
      {
        return done(에러)
      }
      if (!결과) 
      {
        return done(null, false, { message: '존재하지않는 아이디' })
      }

      if (입력한비번 == 결과.password) 
      { // 아이디 잇으면 비밀번호 검증
        return done(null, 결과)
      } 
      else 
      {
        return done(null, false, { message: '비밀번호 틀렸어요' })
      }
    })
  }

}));

// 세션 등록(user는 위에 결과의 값이 담겨잇음)
passport.serializeUser(function (user, done) {
  done(null, user.id)
});

passport.deserializeUser(function (아이디, done) 
{
  db.collection('adminUser').findOne({ id: 아이디 }, function (에러, 결과) {
    done(null, 결과) // 결과는 db에서 찾은 id, pw..등등 값
  })
});


//관리자 로그인
//관리자 로그인


app.get('/upload', function(요청, 응답){
    응답.render('upload.ejs')
  }); 