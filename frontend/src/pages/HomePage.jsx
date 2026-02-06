// import React from 'react'
// import Hero from '../components/hero/hero'

// const HomePage = () => {
//   return (
//     <>
//     <Hero/>
//     </>
//   )
// }

// export default HomePage


import React, { useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Badge,
  IconButton,
  Snackbar,
  Stack,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloseIcon from "@mui/icons-material/Close";

// SERVICES ARRAY
const services = [
  { id: 1, title: "Home Cleaning", desc: "Full home deep clean.", img: "https://cdn.prod.website-files.com/640051ce8a159067e1042e74/65d5b19950d874f282b5c35f_woman-with-gloves-cleaning-floor_23-2148520978.jpg", price: "₹499" },
  { id: 2, title: "Electrician", desc: "Electrical repairs & fittings.", img: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_128,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1700638213050-c722c8.jpeg", price: "₹299" },
  { id: 3, title: "Plumbing", desc: "Leak fix, geyser & fittings.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHrLReppmwptOhoZHNJe5Kd5wvQ0tLi8iQyQ&s", price: "₹349" },
  { id: 4, title: "AC Repair", desc: "AC servicing & gas refill.", img: "https://islandcomfort.com/wp-content/uploads/2021/07/Untitled-design-24-1024x683.jpg", price: "₹699" },
  { id: 5, title: "Salon at Home", desc: "Haircut & grooming at home.", img: "https://content.jdmagicbox.com/v2/comp/delhi/y1/011pxx11.xx11.210325201023.n2y1/catalogue/pamper-at-home-noida-noida-beauty-parlours-c7h6yspz14.jpg", price: "₹599" },
  { id: 6, title: "Pest Control", desc: "Safe pest control treatments.", img: "https://5.imimg.com/data5/SELLER/Default/2023/11/363792242/TF/WA/IK/2553956/pest-control-services-in-gurgaon.jpeg", price: "₹899" },
  { id: 7, title: "Painting", desc: "Interior & exterior painting.", img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&w=800&q=60", price: "₹1299" },
  { id: 8, title: "Carpentry", desc: "Furniture repair & carpentry.", img: "https://cdn.prod.website-files.com/6390e14cc734a931f8327343/679c741cfd2f81997c15fb20_Featured-image.jpg", price: "₹799" },
];

const HomePage = () => {
  const [cart, setCart] = useState([]);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");

  // Add to Cart
  const addToCart = (service) => {
    if (!cart.includes(service.id)) {
      setCart((prev) => [...prev, service.id]);
      setSnackMsg(`${service.title} added to cart`);
      setSnackOpen(true);
    } else {
      setSnackMsg(`${service.title} is already in cart`);
      setSnackOpen(true);
    }
  };

  // Remove from Cart
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((sid) => sid !== id));
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      
      {/* LEFT SIDEBAR */}
      <Box
        sx={{
          width: { xs: "100%", sm: 360 },
          maxWidth: 360,
          borderRight: 1,
          borderColor: "divider",
          overflowY: "auto",
          p: 2,
          bgcolor: "background.paper",
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight="bold">Services</Typography>
          <IconButton aria-label="cart">
            <Badge badgeContent={cart.length} color="primary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Stack>

        <Stack spacing={2}>
          {services.map((s) => (
            <Card key={s.id} sx={{ borderRadius: 2 }}>
              <CardMedia component="img" height="140" image={s.img} alt={s.title} />
              <CardContent sx={{ pb: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>{s.title}</Typography>
                <Typography variant="body2" color="text.secondary">{s.desc}</Typography>
                <Typography variant="subtitle2" sx={{ mt: 1 }}>{s.price}</Typography>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button variant="contained" fullWidth onClick={() => addToCart(s)}>
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          ))}
        </Stack>
      </Box>

      {/* RIGHT CONTENT */}
      <Box sx={{ flex: 1, p: 4 }}>
        <img
          src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1696852847761-574450.jpeg"
          alt="banner"
          style={{ width: "100%", borderRadius: 8 }}
        />

        {/* Cart Items */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Cart Items</Typography>
          {cart.length === 0 ? (
            <Typography color="text.secondary">Cart is empty.</Typography>
          ) : (
            <Stack spacing={1} mt={1}>
              {cart.map((sid) => {
                const svc = services.find((x) => x.id === sid);
                return (
                  <Box
                    key={sid}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 1,
                      p: 1,
                    }}
                  >
                    <Box>
                      <Typography variant="body1">{svc.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{svc.price}</Typography>
                    </Box>
                    <Button color="error" onClick={() => removeFromCart(sid)}>Remove</Button>
                  </Box>
                );
              })}
            </Stack>
          )}
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={1800}
        onClose={() => setSnackOpen(false)}
        message={snackMsg}
        action={
          <IconButton size="small" color="inherit" onClick={() => setSnackOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

export default HomePage;
