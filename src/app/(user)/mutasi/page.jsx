"use client"
import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { numberToRupiah } from "@/utils/rupiah"; // Utility to format prices in Rupiah
import useAuth from "@/app/hooks/useAuth"; // Custom hook to get user info
import Navbar from "@/components/Navbar";

const Mutasi = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [totalMutasi, setTotalMutasi] = useState(0);

  // Fetch cart data in real-time from Firestore
  useEffect(() => {
    if (user) {
      const cartDocRef = doc(db, "cart", user.uid);

      // Listen to cart changes in Firestore
      const unsubscribe = onSnapshot(cartDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const cartData = docSnapshot.data().pesanan || [];
          setCartItems(cartData);

          // Calculate total, using 0 as a fallback for missing or invalid `price`
          const total = cartData.reduce((sum, item) => {
            const itemPrice = parseInt(item.price) || 0;
            return sum + itemPrice;
          }, 0);
          setTotalMutasi(total);
        } else {
          setCartItems([]);
          setTotalMutasi(0);
        }
      });

      // Clean up the listener on unmount
      return () => unsubscribe();
    }
  }, [user]);

  return (
    <>
    <Navbar/>
    <div className="mb-30" style={{ paddingTop: '150px', paddingLeft: '100px' }}>
      <h2>Detail Pembayaran</h2>
      {cartItems.length === 0 ? (
        <p>Tidak ada item dalam mutasi.</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              <p>
                {item.title}: {numberToRupiah(parseInt(item.price) || 0)}
              </p>
              <p>Kategori: {item.category}</p>
              <p>Deskripsi: {item.description}</p>
            </li>
          ))}
        </ul>
      )}
      <p>Total: {numberToRupiah(totalMutasi)}</p>
    </div>
    </>
  );
};

export default Mutasi;
