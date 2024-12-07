'use client';

import { useEffect, useState } from 'react';

export default function InteractiveButtons({
  productId,
  inWishlist,
  isOwned,
}: {
  productId: string;
  inWishlist: boolean;
  isOwned: boolean;
}) {
  const [wishlistStatus, setWishlistStatus] = useState(inWishlist);
  const [ownedStatus, setOwnedStatus] = useState(isOwned);
  const [unmarkStatus, setUnmarkStatus] = useState(!(isOwned || inWishlist));
    console.log(wishlistStatus,ownedStatus,unmarkStatus)
  const handleWishlistClick = async () => {
    const response = await fetch('/api/user/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });

    if (response.ok) {
        setWishlistStatus(true);
        setOwnedStatus(false);
        setUnmarkStatus(false);
    } else {
      alert('Failed to add to wishlist.');
    }
  };

  const handleMarkAsOwnedClick = async () => {
    const response = await fetch('/api/user/owned', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });

    if (response.ok) {
        setWishlistStatus(false);
        setOwnedStatus(true);
        setUnmarkStatus(false);
    } else {
      alert('Failed to mark as owned.');
    }
  };

  const handleUnmarkClick = async () => {
    const response = await fetch('/api/user/unmark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });

    if (response.ok) {
        setWishlistStatus(false);
        setOwnedStatus(false);
        setUnmarkStatus(true);
      
    } else {
      alert('Failed to unmark.');
    }
  };

  return (
    <div className="mt-6 flex justify-center gap-4">
      <button
        className={`btn ${wishlistStatus ? 'btn-disabled' : 'btn-primary'}`}
        onClick={!wishlistStatus ? handleWishlistClick : undefined}
        disabled={wishlistStatus}
      >
        {wishlistStatus ? 'In Wishlist' : 'Add to Wishlist'}
      </button>
      <button
        className={`btn ${ownedStatus ? 'btn-disabled' : 'btn-primary'}`}
        onClick={!ownedStatus ? handleMarkAsOwnedClick : undefined}
        disabled={ownedStatus}
      >
        {ownedStatus ? 'Owned' : 'Mark as Owned'}
      </button>
      <button
        className={`btn ${unmarkStatus ? 'btn-disabled' : 'btn-primary'}`}
        onClick={!unmarkStatus ? handleUnmarkClick : undefined}
        disabled={unmarkStatus}
      >
        {unmarkStatus ? 'Unmark' : 'Unmark'}
      </button>
    </div>
  );
}
